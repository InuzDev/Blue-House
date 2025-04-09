#include <SPI.H>
#include <Arduino.h>
#include <WiFi101.h>
#include <ArduinoHttpClient.h>
#include <secret.h>

// WiFi credentials, are located in secret.h which is in the "include/*" directory
WiFiClient wifi;
HttpClient client = HttpClient(wifi, SERVER_ADDRESS, BACKEND_PORT);

int status = WL_IDLE_STATUS;
String apiEndpoint = "/data";

// ADE7753 Register Addresses
#define WAVEFORM 0x01 // Waveform register
#define AENERGY 0x02  // Active energy register
#define RAENERGY 0x03 // Active energy register (reset on read)
#define MODE 0x09     // Mode register
#define LINECYC 0x1D  // Line cycle energy accumulation mode
#define IRMS 0x24     // Current channel RMS register
#define VRMS 0x25     // Voltage channel RMS register
#define RSTATUS 0x1A  // Reset interrupt status register
#define GAIN 0x23     // PGA gain register

// SPI pins set up for ADE7753
const int ADE7753_CS_PIN = 6;    // Chip select pin
const int ADE7753_RESET_PIN = 7; // Reset pin

// Calibration constant - adjust these based on calibration
const float CURRENT_CALIBRATION = 0.84;
const float VOLTAGE_CALIBRATION = 1.5789;
const float POWER_CALIBRATION = 0.1;

// Variables for energy monitoring
float voltage = 0;
float current = 0;
float power = 0;
float energy = 0;
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 10000; // Send data every 10 seconds
unsigned long lastEnergyCalcTime = 0;

// Function prototypes
void printWiFiStatus();
void setupADE7753();
void writeRegister(byte reg, unsigned int value);
unsigned int readRegister(byte reg);
unsigned long readLongRegister(byte reg);
void readEnergyMeasurements();
float convertCurrent(unsigned int raw);
float convertVoltage(unsigned int raw);
float convertPower(unsigned long raw);
void calculateEnergy();
void sendDataToServer();
void printWiFiStatus();

void setup()
{
   // This code run onces
   Serial.begin(9600);
   while (!Serial)
      ;

   // Init SPI connection to ADE7753
   setupADE7753();

   // Check for the WiFi module:
   if (WiFi.status() == WL_NO_SHIELD)
   {
      Serial.println("WiFi module not present");
      while (true)
      {
      } // halt
   }

   // Else, if there is a shield, attempt to connect to Wi-Fi network
   while (status != WL_CONNECTED)
   {
      Serial.print("Attempting to connect to the Network/SSID: ");
      Serial.println(WIFI_SSID);

      // Connect to the desired network
      status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

      delay(2000); // Wait 2 seconds before retrying
   }

   Serial.println("Connected to WiFi!"); // Print this if the connectio is succesful
   printWiFiStatus();
}

void loop()
{
   // Read measurements from ADE7753
   readEnergyMeasurements();

   // Calculate energy consumption
   calculateEnergy();

   // Print readings to serial monitor
   Serial.println("------------------------------");
   Serial.print("Voltage: ");
   Serial.print(voltage);
   Serial.println(" V");

   Serial.print("Current: ");
   Serial.print(current);
   Serial.println(" A");

   Serial.print("Power: ");
   Serial.print(power);
   Serial.println(" W");

   Serial.print("Energy: ");
   Serial.print(energy);
   Serial.println(" Wh");

   // Send data to server every SEND_INTERVAL milliseconds
   unsigned long currentTime = millis();
   if (currentTime - lastSendTime >= SEND_INTERVAL)
   {
      sendDataToServer();
      lastSendTime = currentTime;
   }

   delay(1000);
}

// Init ADE7753
void setupADE7753()
{
   pinMode(ADE7753_CS_PIN, OUTPUT);
   digitalWrite(ADE7753_CS_PIN, HIGH); // Deselect chip

   // init SPI
   SPI.begin();
   SPI.setDataMode(SPI_MODE3);
   SPI.setBitOrder(MSBFIRST);

   // Reset ADE7753
   if (ADE7753_RESET_PIN > 0)
   {
      pinMode(ADE7753_RESET_PIN, OUTPUT);
      digitalWrite(ADE7753_RESET_PIN, LOW);
      delay(10);
      digitalWrite(ADE7753_RESET_PIN, HIGH);
   }

   // Configure ADE7753 for your specific setup
   writeRegister(MODE, 0x000C); // Set mode: Use line cycle accumulation mode
   writeRegister(LINECYC, 50);  // Number of half line cycles for energy accumulation
   writeRegister(GAIN, 0x0000); // Set PGA gain to 1

   // Use the appropriate gain settings for SCT013-30
   // This will need to be adjusted based on testing

   Serial.println("ADE7753 initialized");

   // Verify communication by reading a known register
   unsigned int dieRev = readRegister(0x3E); // DIE_REV register
   Serial.print("ADE7753 Die Revision: 0x");
   Serial.println(dieRev, HEX);

   if (dieRev == 0)
   {
      Serial.println("ERROR: Could not communicate with ADE7753");
   }
}

// Write a value to an ADE7753 register
void writeRegister(byte reg, unsigned int value)
{
   digitalWrite(ADE7753_CS_PIN, LOW);  // Select chip
   SPI.transfer(reg | 0x80);           // Register address + write flag
   SPI.transfer(value >> 8);           // Upper byte
   SPI.transfer(value & 0xFF);         // Lower byte
   digitalWrite(ADE7753_CS_PIN, HIGH); // Deselect chip
   delayMicroseconds(10);              // Small delay for stability
}

// Send data to the server
void sendDataToServer()
{
   // Create JSON payload
   String contentType = "application/json";
   String postData = "{";
   postData += "\"sensorType\":\"Energy Monitor\",";
   postData += "\"voltage\":" + String(voltage) + ",";
   postData += "\"current\":" + String(current) + ",";
   postData += "\"power\":" + String(power) + ",";
   postData += "\"energy\":" + String(energy);
   postData += "}";

   Serial.println("Sending data to server...");
   Serial.println(postData);

   // Send POST request to server
   client.post(apiEndpoint, contentType, postData);

   // Read response
   int statusCode = client.responseStatusCode();
   String response = client.responseBody();

   Serial.print("Status code: ");
   Serial.println(statusCode);
   Serial.print("Response: ");
   Serial.println(response);
}

// Read a value from an ADE7753 register
unsigned int readRegister(byte reg)
{
   digitalWrite(ADE7753_CS_PIN, LOW);         // Select chip
   SPI.transfer(reg);                         // Register address (read operation)
   delayMicroseconds(1);                      // Small delay
   unsigned int value = SPI.transfer(0) << 8; // Upper byte
   value |= SPI.transfer(0);                  // Lower byte
   digitalWrite(ADE7753_CS_PIN, HIGH);        // Deselect chip
   return value;
}

// Read energy measurements from ADE7753
void readEnergyMeasurements()
{
   // Read current RMS
   unsigned int irmsRaw = readRegister(IRMS);
   current = convertCurrent(irmsRaw);

   // Read voltage RMS - if you have voltage measurement
   unsigned int vrmsRaw = readRegister(VRMS);
   voltage = convertVoltage(vrmsRaw);

   // Read active power
   unsigned long powerRaw = readLongRegister(RAENERGY);
   power = convertPower(powerRaw);
}

// Convert raw register value to actual current for SCT013-30
float convertCurrent(unsigned int raw)
{
   // For SCT013-30 (30A/1V)
   // The exact formula will depend on calibration
   return raw * CURRENT_CALIBRATION;
}

// Convert raw register value to actual voltage
float convertVoltage(unsigned int raw)
{
   // The exact formula will depend on your voltage measurement setup
   return raw * VOLTAGE_CALIBRATION;
}

// Convert raw register value to actual power
float convertPower(unsigned long raw)
{
   // The exact formula will depend on calibration
   return raw * POWER_CALIBRATION;
}

// Calculate energy consumption in watt-hours
void calculateEnergy()
{
   unsigned long now = millis();
   float hoursPassed = (now - lastEnergyCalcTime) / 3600000.0; // Convert ms to hours

   energy += power * hoursPassed;
   lastEnergyCalcTime = now;
}

// Read a long value (24-bit) from an ADE7753 register
unsigned long readLongRegister(byte reg)
{
   digitalWrite(ADE7753_CS_PIN, LOW);                            // Select chip
   SPI.transfer(reg);                                            // Register address (read operation)
   delayMicroseconds(10);                                        // Small delay
   unsigned long value = ((unsigned long)SPI.transfer(0)) << 16; // Upper byte
   value |= ((unsigned long)SPI.transfer(0)) << 8;               // Middle byte
   value |= SPI.transfer(0);                                     // Lower byte
   digitalWrite(ADE7753_CS_PIN, HIGH);                           // Deselect chip
   return value;
}

void printWiFiStatus()
{
   // Print the network name or SSID the board is connected to
   Serial.print("Network name/SSID: ");
   Serial.println(WiFi.SSID());

   // Print the Board's IP address:
   IPAddress ip = WiFi.localIP();
   Serial.print("IP Address: ");
   Serial.println(ip);

   lastEnergyCalcTime = millis();
}