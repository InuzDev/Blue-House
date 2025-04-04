#include <SPI.H>
#include <WiFi101.h>
#include <lib/secret.h>

// WiFi credentials, using the secret.h file.

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
         ; // halt
   }

   // Else, if there is a shield, attempt to connect to Wi-Fi network
   while (status != WL_CONNECTED)
   {
      Serial.print("Attempting to connect to the Network/SSID:");
      Serial.println(WIFI_SSID);

      // Connect to the desired network
      status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

      delay(5000); // Wait 5 seconds before retrying
   }

   Serial.println("Connected to WiFi!"); // Print this if the connectio is succesful
   printWiFiStatus();
}

void loop()
{
   // Code that keep running
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