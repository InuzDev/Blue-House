#include <SPI.H>
#include <Arduino.h>
#include <WiFi101.h>
#include <ArduinoHttpClient.h>
#include <secret.h>

// WiFi credentials, are located in secret.h which is in the "include/*" directory

WiFiClient wifi;
HttpClient client = HttpClient(wifi, SERVER_ADDRESS, BACKEND_PORT);

int status = WL_IDLE_STATUS;

void printWiFiStatus();

void setup()
{
   // This code run onces

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
   // Code that keeps running
   String contentType = "application/json"; // Json File that contain the sensors data
   String postData = "{\"Current sensor\":\"Voltage Sensor\",\"value\":23.5}";

   client.post("/data", contentType, postData);
   int statusCode = client.responseStatusCode();
   String response = client.responseBody();

   // Check to the Server address
   Serial.print("\nTrying to connect to: ");
   Serial.println(SERVER_ADDRESS);

   // Print the status code of the response
   Serial.print("Status code: ");

   // Check if there was an error and print a readable message.
   if (statusCode == -2)
   {
      Serial.print("Connection failed, error code: ");
      Serial.print(statusCode);
      Serial.println(", Retrying in 12 seconds\n");
   }
   else
   {
      Serial.println(statusCode);
   }

   // Print the response
   Serial.print("Response: ");
   Serial.println(response);

   delay(12000); // Delay the logger for 12 seconds.
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
}