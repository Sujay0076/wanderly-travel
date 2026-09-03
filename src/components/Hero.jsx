import "./Hero.css";

function Hero() {
  function handleExplore() {
    document
      .getElementById("destinations")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source
          src="/video/hero.mp4"
          type="video/mp4"
        />
      </video>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <p className="hero-eyebrow">
          TRAVEL · DISCOVER · EXPERIENCE
        </p>

        <h1>
          The world is
          <br />
          waiting for you.
        </h1>

        <p className="hero-description">
          Discover extraordinary places, real-time weather,
          unforgettable experiences and journeys designed
          around you.
        </p>

        <button
          className="hero-button"
          type="button"
          onClick={handleExplore}
        >
          Explore destinations
          <span>→</span>
        </button>
      </div>

      <div className="hero-scroll">
        <span>Scroll to explore</span>
        <span className="scroll-line"></span>
      </div>
    </section>
  );
}

export default Hero;