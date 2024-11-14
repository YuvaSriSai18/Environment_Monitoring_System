const axios = require("axios");
require("dotenv").config();
const getTemp_Humidity = async (latitude, longitude) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`
    );

    // Convert the temperature from Kelvin to Celsius
    const tempInCelsius = res.data.main.temp - 273.15;

    console.log(
      `Temperature: ${tempInCelsius.toFixed(2)} °C\nHumidity: ${
        res.data.main.humidity
      }%`
    );
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

// Example usage: passing latitude and longitude
getTemp_Humidity(16.437599, 80.564598);
