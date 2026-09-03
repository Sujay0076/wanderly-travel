import "./WeatherCard.css";

function WeatherCard({
  weather,
  loading,
  error,
  destinationName,
  destinationCountry,
}) {
  if (loading) {
    return (
      <section className="weather-card weather-loading">
        <p className="weather-label">CURRENT WEATHER</p>
        <p className="weather-status">Loading weather...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="weather-card weather-error">
        <p className="weather-label">CURRENT WEATHER</p>
        <h3>Weather unavailable</h3>
        <p>{error}</p>
      </section>
    );
  }

  if (!weather) {
    return null;
  }

  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const condition =
    weather.weather?.[0]?.description || "Unknown";
  const icon = weather.weather?.[0]?.icon;

  return (
    <section className="weather-card">
      <div className="weather-top">
        <div>
          <p className="weather-label">CURRENT WEATHER</p>

          <h3>
            {destinationName}, {destinationCountry}
          </h3>
        </div>

        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={condition}
            className="weather-icon"
          />
        )}
      </div>

      <div className="weather-main">
        <div className="weather-temperature">
          {temperature}°
        </div>

        <div className="weather-condition">
          <p>{condition}</p>
          <span>Feels like {feelsLike}°C</span>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <span>Humidity</span>
          <strong>{weather.main.humidity}%</strong>
        </div>

        <div className="weather-detail">
          <span>Wind</span>
          <strong>{weather.wind.speed} m/s</strong>
        </div>

        <div className="weather-detail">
          <span>Pressure</span>
          <strong>{weather.main.pressure} hPa</strong>
        </div>
      </div>
    </section>
  );
}

export default WeatherCard;