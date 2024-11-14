const mongoose = require("mongoose");

// Define the schema for individual weather records
const weatherSchema = new mongoose.Schema(
  {
    temperature: { type: Number },
    humidity: { type: Number },
    atmosphericPressure: { type: Number },
    windSpeed: { type: Number },
    visibility: { type: Number },
    carbon: { type: Number },
    hydrogen: { type: Number },
    smoke: { type: Number },
    gasLeak: { type: Number },
  },
  { timestamps: true }
);

// Define the main schema for weather data with location and weatherRecords array
const weatherDataSchema = new mongoose.Schema({
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    cityName: { type: String, required: true },
  },
  weatherRecords: [weatherSchema],
});

// Create a model for the schema
const WeatherData = mongoose.model("WeatherData", weatherDataSchema);

module.exports = WeatherData;
