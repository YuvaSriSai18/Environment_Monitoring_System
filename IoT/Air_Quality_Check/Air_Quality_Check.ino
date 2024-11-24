#include <WiFi.h>
#include <HTTPClient.h>
// WiFi credentials
const char* ssid = "wifi-username";  // Replace with your WiFi SSID
const char* password = "wifi-password";  // Replace with your WiFi password

// Server URL
const char* serverUrl = "https://hk9zkn3x-3423.inc1.devtunnels.ms/api";

// Sensor pin mappings for ESP32
const int mq2Pin = 34;  // MQ2 sensor connected to GPIO 34
const int mq8Pin = 35;  // MQ8 sensor connected to GPIO 35
const int mq7Pin = 32;  // MQ7 sensor connected to GPIO 32
const int mq6Pin = 33;  // MQ6 sensor connected to GPIO 33

// Sensor values
float mq2Value;
float mq8Value;
float mq7Value;
float mq6Value;

void setup() {
  Serial.begin(9600);  // Initialize serial communication

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi.");
}

void loop() {
  // Read analog values from the sensors
  mq2Value = analogRead(mq2Pin);
  mq8Value = analogRead(mq8Pin);
  mq7Value = analogRead(mq7Pin);
  mq6Value = analogRead(mq6Pin);


  // Print the sensor values to the Serial Monitor
  Serial.print("MQ2 Value: ");
  Serial.println(mq2Value);
  Serial.print("MQ7 Value: ");
  Serial.println(mq7Value);
  Serial.print("MQ6 Value: ");
  Serial.println(mq6Value);
  Serial.print("MQ8 Value: ");
  Serial.println(mq8Value);

  // Send sensor data to the server
  sendDataToServer();

  // Delay for 10 seconds (adjust as needed)
  delay(60000 );
}

void sendDataToServer() {
  // int i = 0;
  if (WiFi.status() == WL_CONNECTED) {  // Check if the ESP32 is connected to WiFi
    HTTPClient http;
    http.begin(serverUrl);                               // Specify the URL
    http.addHeader("Content-Type", "application/json");  // Specify content type as JSON
    float latitude = 16.4346;
    float longitude = 80.5662;
    // Create JSON object with sensor values
    String jsonData = String("{\"mq2\":") + mq2Value + ",\"mq8\":" + mq8Value + ",\"mq7\":" + mq7Value + ",\"mq6\":" + mq6Value + ",\"latitude\":" + latitude + ",\"longitude\":" + longitude + "}";

    // Send the HTTP POST request
    int httpResponseCode = http.POST(jsonData);

    // Check response code
    if (httpResponseCode > 0) {
      String response = http.getString();  // Get the response from the server
      Serial.println("Data server response: " + response);
      // Serial.println("Iteration : " + i); 
      // i = i + 1;
    } else {
      Serial.println("Error sending POST request: " + String(httpResponseCode));
    }

    http.end();  // Close connection
  } else {
    Serial.println("WiFi disconnected");
  }
}
