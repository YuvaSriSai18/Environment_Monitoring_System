const router = require("express").Router();
const axios = require("axios");
const WeatherData = require("../models/Weather"); // Make sure to have the correct path to your model file
require("dotenv").config();

router.post("/", async (req, res) => {
  const { mq2, mq7, mq8, mq6, latitude, longitude } = req.body;

  try {
    // Fetch weather data based on latitude and longitude
    const {
      temperature,
      humidity,
      atmosphericPressure,
      windSpeed,
      visibility,
      cityName,
    } = await getWeatherData(latitude, longitude);

    // Create a new weather record object
    const newWeatherRecord = {
      temperature: parseFloat(temperature),
      humidity,
      atmosphericPressure,
      windSpeed,
      visibility,
      carbon: mq2,
      hydrogen: mq7,
      smoke: mq8,
      gasLeak: mq6,
    };

    // Check if a document already exists for this location (based on cityName)
    let weatherData = await WeatherData.findOne({
      "location.cityName": cityName,
    });

    if (weatherData) {
      // If the location exists, push the new weather record into the weatherRecords array
      weatherData.weatherRecords.push(newWeatherRecord);
      await weatherData.save();
    } else {
      // If the location doesn't exist, create a new document
      weatherData = new WeatherData({
        location: {
          latitude,
          longitude,
          cityName,
        },
        weatherRecords: [newWeatherRecord],
      });
      await weatherData.save();
    }

    // Respond with a success message
    res.json({
      message: "Weather data saved successfully",
      // cityName,
      // temperature,
      // humidity,
      // atmosphericPressure,
      // windSpeed,
      // visibility,
      // mq2,
      // mq7,
      // mq8,
      // mq6,
    });
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    res.status(500).json({ message: "Failed to fetch and save weather data" });
  }
  // console.log(req.body)
  // return res.send(`Data received`)
});

// Function to fetch weather data from OpenWeatherMap API
const getWeatherData = async (latitude, longitude) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`
    );

    // Extract relevant weather data
    const temperature = res.data.main.temp - 273.15; // Convert Kelvin to Celsius
    const humidity = res.data.main.humidity;
    const atmosphericPressure = res.data.main.pressure;
    const windSpeed = res.data.wind.speed;
    const visibility = res.data.visibility;
    const cityName = res.data.name;

    return {
      temperature: temperature.toFixed(2),
      humidity,
      atmosphericPressure,
      windSpeed,
      visibility,
      cityName,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

module.exports = router;
