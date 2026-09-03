import DestinationCard from "./DestinationCard";
import "./DestinationGrid.css";

function DestinationGrid({ destinations }) {
  if (destinations.length === 0) {
    return (
      <div className="empty-destinations">
        <h3>No destinations found</h3>
        <p>
          Try searching for another destination or changing the filter.
        </p>
      </div>
    );
  }

  return (
    <div className="destination-grid">
      {destinations.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
        />
      ))}
    </div>
  );
}

export default DestinationGrid;