import { Link } from "react-router-dom";
import "./DestinationCard.css";

function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destination/${destination.id}`}
      className="destination-card"
    >
      <div className="destination-image-wrapper">
        <img
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          className="destination-image"
        />

        <span className="destination-category">
          {destination.category}
        </span>

        <span className="destination-arrow">↗</span>
      </div>

      <div className="destination-info">
        <div>
          <h3>{destination.name}</h3>
          <p>{destination.country}</p>
        </div>

        <p className="destination-description">
          {destination.description}
        </p>
      </div>
    </Link>
  );
}

export default DestinationCard;