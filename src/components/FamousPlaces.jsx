import { useEffect, useState } from "react";
import { searchImages } from "../services/imageService";
import "./FamousPlaces.css";

function FamousPlaces({ places }) {
  const [placeImages, setPlaceImages] = useState({});
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    if (!places || places.length === 0) {
      setImagesLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPlaceImages() {
      setImagesLoading(true);

      const imageResults = await Promise.allSettled(
        places.map(async (place) => {
          const photos = await searchImages(
            place.name,
            1
          );

          return {
            name: place.name,
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
          images[result.value.name] = result.value.image;
        }
      });

      setPlaceImages(images);
      setImagesLoading(false);
    }

    loadPlaceImages();

    return () => {
      cancelled = true;
    };
  }, [places]);

  if (!places || places.length === 0) {
    return null;
  }

  return (
    <section className="famous-places">
      <div className="famous-places-heading">
        <div>
          <p className="section-eyebrow">DON'T MISS</p>

          <h2>Famous places</h2>
        </div>

        <p>
          Places worth adding to your journey,
          from iconic landmarks to unforgettable views.
        </p>
      </div>

      {imagesLoading && (
        <p className="places-loading">
          Loading place imagery...
        </p>
      )}

      <div className="places-grid">
        {places.map((place, index) => (
          <article
            className="place-card"
            key={place.name}
          >
            <div className="place-image-wrapper">
              {placeImages[place.name] ? (
                <img
                  src={placeImages[place.name]}
                  alt={place.name}
                  className="place-image"
                  loading="lazy"
                />
              ) : (
                <div
                  className="place-image-fallback"
                  aria-label={`${place.name} image unavailable`}
                >
                  <span>{place.name}</span>
                </div>
              )}

              <span className="place-number">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="place-content">
              <h3>{place.name}</h3>

              <p>{place.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FamousPlaces;