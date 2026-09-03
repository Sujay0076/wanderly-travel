import { useEffect, useMemo, useState } from "react";
import destinations from "../data/destinations";
import { searchImages } from "../services/imageService";
import DestinationGrid from "./DestinationGrid";
import "./DestinationExplorer.css";

function DestinationExplorer() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [destinationImages, setDestinationImages] = useState({});
  const [imagesLoading, setImagesLoading] = useState(true);

  const categories = [
    "All",
    "Beach",
    "City",
    "Culture",
    "Nature",
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadDestinationImages() {
      setImagesLoading(true);

      const imageResults = await Promise.allSettled(
        destinations.map(async (destination) => {
          const photos = await searchImages(
            `${destination.name} ${destination.country}`,
            1
          );

          return {
            id: destination.id,
            image: photos[0]?.src?.landscape,
          };
        })
      );

      if (cancelled) {
        return;
      }

      const images = {};

      imageResults.forEach((result) => {
        if (
          result.status === "fulfilled" &&
          result.value.image
        ) {
          images[result.value.id] = result.value.image;
        }
      });

      setDestinationImages(images);
      setImagesLoading(false);
    }

    loadDestinationImages();

    return () => {
      cancelled = true;
    };
  }, []);

  const destinationsWithImages = useMemo(() => {
    return destinations.map((destination) => ({
      ...destination,
      image: destinationImages[destination.id] || null,
    }));
  }, [destinationImages]);

  const filteredDestinations = useMemo(() => {
    return destinationsWithImages.filter((destination) => {
      const matchesSearch =
        destination.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        destination.country
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        destination.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [
    search,
    category,
    destinationsWithImages,
  ]);

  return (
    <section
      className="explorer"
      id="destinations"
    >
      <div className="explorer-container">
        <div className="explorer-heading">
          <div>
            <p className="section-eyebrow">
              DISCOVER THE WORLD
            </p>

            <h2>
              Where will you
              <br />
              go next?
            </h2>
          </div>

          <p className="explorer-intro">
            Explore destinations worth putting on your map.
            Find your next escape, from quiet landscapes to
            unforgettable cities.
          </p>
        </div>

        <div className="explorer-controls">
          <div className="search-wrapper">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search destinations"
            />
          </div>

          <div
            className="filter-buttons"
            aria-label="Destination categories"
          >
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {imagesLoading && (
          <p className="image-loading-message">
            Loading destination imagery...
          </p>
        )}

        <DestinationGrid
          destinations={filteredDestinations}
        />

        <p className="pexels-attribution">
          Destination photography provided by{" "}
          <a
            href="https://www.pexels.com/"
            target="_blank"
            rel="noreferrer"
          >
            Pexels
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export default DestinationExplorer;