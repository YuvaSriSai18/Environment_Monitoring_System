# Environmental Monitoring System

The **Environmental Monitoring System** is a project designed to track environmental parameters such as air quality, temperature, and humidity, predict pollution trends, and alert users in real-time. By leveraging IoT devices (simulated via frontend inputs), machine learning, and web technologies, this project aims to empower communities to respond proactively to environmental changes.

---

## Features

1. **Real-Time Monitoring**:

   - Simulates IoT devices by accepting environmental data input from the frontend.
   - Monitors air quality, temperature, and humidity.

2. **Machine Learning**:

   - **Random Forest Classifier** for AQI bucket prediction based on input parameters.
   - Future-ready for time-series forecasting, anomaly detection, and clustering for advanced use cases.

3. **Web-Based Dashboard**:

   - A React-based frontend for users to input environmental parameters and view predictions and alerts.

4. **Scalability**:
   - Designed to integrate IoT devices (e.g., Arduino, ESP32) for live data collection.
   - Flask API for seamless integration between ML models and the web interface.

---

## Architecture

1. **Frontend (React)**:

   - Accepts environmental parameter inputs (e.g., air quality, temperature, humidity).
   - Displays predictions and real-time alerts.

2. **Backend (Flask)**:

   - Exposes an API to handle requests from the frontend.
   - Hosts the trained Random Forest Classifier ML model for AQI predictions.

3. **Machine Learning**:

   - Processes the input data to predict the Air Quality Index (AQI) bucket.
   - Future-ready for additional ML models like time-series forecasting.

4. **IoT Devices (Simulated)**:
   - Environmental parameter inputs are manually provided via the frontend to simulate IoT-enabled devices.

---

## Project Setup

### Prerequisites

- Python 3.8 or above
- Node.js and npm
- Flask
- React
- `flask-cors` for handling cross-origin requests
- Required Python libraries: `pandas`, `scikit-learn`, `flask`, `flask-cors`

---

### Backend Setup (Flask + ML Model)

1. Clone the repository:

   ```bash
   git clone https://github.com/YuvaSriSai18/Environment_Monitoring_System.git
   ```

2. Frontend Setup :

   ```
   cd client
   npm install
   npm run dev
   ```

   ### Simulating Environmental Data

   1. Open the React application.
   2. Input environmental parameters (air quality, temperature, humidity).
   3. Submit the data to receive the predicted AQI bucket and alerts.

## Example Data Flow

- ## Frontend:
  - Input data: `{ "PM2.5": 60, "PM10": 100, "Temperature": 35, "Humidity": 50 }`
  - Sends the data via a POST request to the Flask API.
- ## Backend:

      - Flask receives the input data.

  Random Forest Classifier predicts the AQI bucket (e.g., "Moderate"). - The prediction is sent back to the frontend.

- ## Frontend:
  - Displays the predicted AQI bucket and any associated alerts.

## Technologies Used

- `Frontend` : React
- `Backend` : Flask with Flask-CORS , Express JS
- `Machine Learning` : Scikit-learn (Random Forest Classifier)
- `IoT Hardware` : ESP32 , MQ2 , MQ6 MQ7 , MQ8

## Impact

The Environmental Monitoring System provides real-time environmental insights, empowering communities to:

    1. Take proactive measures against pollution.
    2. Monitor air quality and weather conditions.
    3. Stay informed about their environment for better decision-making
