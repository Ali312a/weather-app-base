import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const OPEN_WEATHER_API_KEY = "15d2573f08fe7873e18a04108ec24d39"; // Replace with your API key

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Step 1: Fetch city coordinates (lat, lon) using the Geocoding API
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
      )
      .then((response) => {
        if (response.data.length === 0) {
          throw new Error("City not found");
        }
        const { lat, lon } = response.data[0];
        return axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
        );
      })
      .then((response) => {
        setWeatherData(response.data);
        setError("");
      })
      .catch((err) => {
        setError("Error fetching weather data. Please try again.");
        console.error(err);
      });
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
        </div>
      )}
    </div>
  );
}

export default App;