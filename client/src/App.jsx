import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const apiKey = "ce361914da9723bbe601e740dbc10f71"; // Replace with your valid OpenWeatherMap API key
const apiEndpoint = "http://127.0.0.1:5000/predict"; // Replace with your actual API endpoint

function App() {
  const [location, setLocation] = useState("Fetching your location...");
  const [area, setArea] = useState("");
  const [weather, setWeather] = useState("Fetching weather information...");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [airQualityData, setAirQualityData] = useState({
    "PM2.5": 0,
    PM10: 0,
    NO: 0,
    NO2: 0,
    NH3: 0,
    NOx: 0,
    CO: 0,
    SO2: 0,
    O3: 0,
    Benzene: 0,
    Toluene: 0,
    AQI: 0,
  });

  useEffect(() => {
    // Function to fetch and display weather data
    async function getWeather(latitude, longitude) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("Failed to fetch weather data.");

        const data = await response.json();

        // Extract weather details
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const conditions = data.weather[0].description;
        const visibility = (data.visibility / 1000).toFixed(1);
        const areaName = `${data.name}, ${data.sys.country}`;

        setArea(`Area: ${areaName}`);
        setWeather(
          `Current Weather: ${
            conditions.charAt(0).toUpperCase() + conditions.slice(1)
          }<br>
          Temperature: ${temperature}°C, Humidity: ${humidity}%, Visibility: ${visibility} km`
        );
      } catch (error) {
        console.error("Weather API error:", error);
        setArea("Error fetching area information.");
        setWeather("Error fetching weather data.");
      }
    }

    // Function to get and display the user's location
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setLocation(
              `Your location: Latitude ${latitude}, Longitude ${longitude}`
            );
            getWeather(latitude, longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocation("Unable to retrieve location.");
            setArea("Location not found.");
            setWeather("Unable to fetch weather information.");
          }
        );
      } else {
        setLocation("Geolocation is not supported by your browser.");
        setArea("Location unavailable.");
        setWeather("Weather information unavailable.");
      }
    }

    getLocation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAirQualityData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiEndpoint, airQualityData);

      setConfirmationMessage(
        `Air quality data submitted successfully! Quality of Air is: ${response.data["Predicted AQI Bucket"]}`
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error posting data to API:", error);
      setConfirmationMessage(
        "Error submitting air quality data. Please try again."
      );
    }
  };

  return (
    <div>
      <div className="header">WELCOME!!</div>
      <div className="info">{location}</div>
      <div className="info">{area}</div>
      <div className="info" dangerouslySetInnerHTML={{ __html: weather }}></div>
      <div className="info">
        <div className="air-quality-form">
          <h3>Enter Air Quality Parameters</h3>
          <form onSubmit={handleSubmit}>
            {Object.keys(airQualityData).map((key) => (
              <div key={key}>
                <label htmlFor={key}>
                  Enter {key.replace(/([A-Z])/g, " $1")} value:
                </label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  value={airQualityData[key]}
                  onChange={handleChange}
                />
                <br />
              </div>
            ))}
            <button type="submit">Submit</button>
          </form>
        </div>
        <div id="confirmationMessage">{confirmationMessage}</div>
      </div>
    </div>
  );
}

export default App;
