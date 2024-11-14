const mongoose = require("mongoose");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const WeatherData = require("../models/Weather"); // Ensure this path is correct based on your project structure
const path = require("path");
const admin = require("firebase-admin");
const fs = require("fs");
require("dotenv").config();

const serviceAccount = require("../firebase/serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_URI, // Replace with your actual Firebase storage bucket name
});

async function uploadCsvToFirebase(filePath, cityName) {
  try {
    // Get reference to the Firebase storage bucket
    const bucket = admin.storage().bucket();

    // Create a reference to the file you want to upload
    const file = bucket.file(`weather_data/${cityName}_weather.csv`); // Store CSV files in a folder called "weather_data"

    // Upload the file to Firebase Storage
    await file.save(fs.readFileSync(filePath), {
      contentType: "text/csv", // Set content type to CSV
      metadata: {
        customMetadata: {
          cityName: cityName,
          date: new Date().toISOString(), // Store the current timestamp
        },
      },
    });

    // Retrieve the public download URL for the uploaded file
    const [downloadUrl] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // Set expiration time for the download URL (far future)
    });

    console.log(`${cityName}_weather.csv uploaded successfully.`);
    console.log("Download URL: ", downloadUrl);

    return downloadUrl; // Return the download URL
  } catch (error) {
    console.error("Error uploading CSV to Firebase:", error);
    throw new Error("Upload failed");
  }
}

async function generateAndUploadCsvFiles() {
  const downloadUrls = [];

  try {
    await mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => `mongoose done`)
      .catch((err) => {
        console.log(`Error ${err}`);
        return;
      });

    // Fetch all weather data entries
    const weatherData = await WeatherData.find();

    // Group data by cityName
    const cityData = {};

    // Iterate through weatherData and group by cityName
    weatherData.forEach((entry) => {
      entry.weatherRecords.forEach((record) => {
        const cityName = entry.location.cityName;

        // Initialize city data if not already present
        if (!cityData[cityName]) {
          cityData[cityName] = [];
        }

        // Push the record for the respective city
        cityData[cityName].push({
          temperature: record.temperature,
          humidity: record.humidity,
          atmosphericPressure: record.atmosphericPressure,
          windSpeed: record.windSpeed,
          visibility: record.visibility,
          carbon: record.carbon,
          hydrogen: record.hydrogen,
          smoke: record.smoke,
          gasLeak: record.gasLeak,
          latitude: entry.location.latitude,
          longitude: entry.location.longitude,
          cityName: entry.location.cityName,
          createdAt: record.createdAt,
        });
      });
    });

    // Iterate through each city and create a CSV file
    for (const cityName in cityData) {
      const records = cityData[cityName];

      // Configure the CSV writer for each city
      const csvFilePath = path.join(`./Datasets/${cityName}_weather_data.csv`); // Save CSV file locally in the "Datasets" folder

      const csvWriter = createCsvWriter({
        path: csvFilePath, // Unique file for each city
        header: [
          { id: "temperature", title: "Temperature" },
          { id: "humidity", title: "Humidity" },
          { id: "atmosphericPressure", title: "Atmospheric Pressure" },
          { id: "windSpeed", title: "Wind Speed" },
          { id: "visibility", title: "Visibility" },
          { id: "carbon", title: "Carbon" },
          { id: "hydrogen", title: "Hydrogen" },
          { id: "smoke", title: "Smoke" },
          { id: "gasLeak", title: "Gas Leak" },
          { id: "latitude", title: "Latitude" },
          { id: "longitude", title: "Longitude" },
          { id: "cityName", title: "City Name" },
          { id: "createdAt", title: "Timestamp" },
        ],
      });

      // Write records to the CSV file for each city, automatically overriding if it exists
      await csvWriter.writeRecords(records);
      console.log(`CSV file for city "${cityName}" created successfully!`);

      // After CSV file is created, upload it to Firebase Storage
      try {
        const downloadUrl = await uploadCsvToFirebase(csvFilePath, cityName);
        downloadUrls.push(downloadUrl); // Add the download URL to the array
      } catch (uploadError) {
        console.error(
          `Error uploading ${cityName} CSV to Firebase:`,
          uploadError
        );
      }
    }

    // Return or log the array of download URLs
    console.log("All download URLs:", downloadUrls);
    return downloadUrls; // You can use this array to do further processing or return it to the caller
  } catch (error) {
    console.error("Error generating CSV files:", error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

// Run the function to generate and upload CSV files
generateAndUploadCsvFiles();
