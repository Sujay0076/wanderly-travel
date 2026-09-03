import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import destinations from "../data/destinations";
import FamousPlaces from "../components/FamousPlaces";
import WeatherCard from "../components/WeatherCard";
import { getCurrentWeather } from "../services/weatherServices";
import { searchImages } from "../services/imageService";
import "./DestinationDetails.css";

function DestinationDetails() {
  const { id } = useParams();

  const destination = destinations.find(
    (item) => item.id === id
  );

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  const [destinationImage, setDestinationImage] =
    useState(null);

  const [imageLoading, setImageLoading] =
    useState(true);

  useEffect(() => {
    if (!destination) {
      return;
    }

    async function fetchWeather() {
      try {
        setWeatherLoading(true);
        setWeatherError("");

        const data = await getCurrentWeather(
          destination.latitude,
          destination.longitude
        );

        setWeather(data);
      } catch (error) {
        console.error("Weather error:", error);

        setWeatherError(error.message);
      } finally {
        setWeatherLoading(false);
      }
    }

    async function fetchDestinationImage() {
      try {
        setImageLoading(true);

        const photos = await searchImages(
          `${destination.name} ${destination.country}`,
          1
        );

        const image = photos[0]?.src?.landscape;

        if (image) {
          setDestinationImage(image);
        } else {
          setDestinationImage(null);
        }
      } catch (error) {
        console.error(
          "Destination image error:",
          error
        );

        setDestinationImage(null);
      } finally {
        setImageLoading(false);
      }
    }

    fetchWeather();
    fetchDestinationImage();
  }, [destination]);

  if (!destination) {
    return (
      <main className="destination-not-found">
        <h1>Destination not found</h1>

        <p>
          We couldn't find the destination you're looking for.
        </p>

        <Link to="/">Back to home</Link>
      </main>
    );
  }

  return (
    <main className="destination-details">
      <section className="destination-details-hero">
        {imageLoading ? (
          <div className="destination-hero-loading">
            <span>Loading destination...</span>
          </div>
        ) : destinationImage ? (
          <img
            src={destinationImage}
            alt={`${destination.name}, ${destination.country}`}
          />
        ) : (
          <div className="destination-hero-fallback">
            <span>{destination.name}</span>
          </div>
        )}

        <div className="destination-details-overlay"></div>

        <Link to="/" className="back-button">
          ← Back
        </Link>

        <div className="destination-details-content">
          <p>{destination.category}</p>

          <h1>{destination.name}</h1>

          <span>{destination.country}</span>
        </div>
      </section>

      <section className="destination-overview">
        <p className="section-eyebrow">
          ABOUT THE DESTINATION
        </p>

        <h2>{destination.name}</h2>

        <p className="destination-overview-text">
          {destination.description}
        </p>

        <WeatherCard
          weather={weather}
          loading={weatherLoading}
          error={weatherError}
          destinationName={destination.name}
          destinationCountry={destination.country}
        />
      </section>

      <FamousPlaces places={destination.places} />
    </main>
  );
}

export default DestinationDetails;