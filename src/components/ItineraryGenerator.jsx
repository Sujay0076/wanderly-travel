import { useState } from "react";
import { askGemini } from "../services/geminiService";
import "./ItineraryGenerator.css";

function ItineraryGenerator() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(event) {
    event.preventDefault();

    if (!destination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    setLoading(true);
    setError("");
    setItinerary(null);

    const prompt = `
You are Wanderly AI, an expert travel planner.

Create a practical ${days}-day travel itinerary for:
${destination.trim()}

Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in backticks.

Use exactly this structure:

{
  "destination": "Destination name",
  "summary": "Short trip summary",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "Morning",
          "title": "Activity title",
          "description": "Short useful description"
        },
        {
          "time": "Afternoon",
          "title": "Activity title",
          "description": "Short useful description"
        },
        {
          "time": "Evening",
          "title": "Activity title",
          "description": "Short useful description"
        }
      ]
    }
  ]
}

Make the itinerary realistic and varied.
Include famous attractions, local experiences, food opportunities,
and reasonable travel pacing.
Do not claim real-time availability, prices, weather, or events.
`;

    try {
      const response = await askGemini(prompt);

      const cleanedResponse = response
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsedItinerary = JSON.parse(cleanedResponse);

      if (
        !parsedItinerary.days ||
        !Array.isArray(parsedItinerary.days)
      ) {
        throw new Error(
          "Gemini returned an invalid itinerary format."
        );
      }

      setItinerary(parsedItinerary);
    } catch (error) {
      console.error("Itinerary error:", error);

      setError(
        error.message ||
          "Unable to generate the itinerary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="itinerary" id="itinerary">
      <div className="itinerary-container">
        <div className="itinerary-heading">
          <p className="section-eyebrow">PLAN YOUR JOURNEY</p>

          <h2>
            Your trip,
            <br />
            beautifully planned.
          </h2>

          <p>
            Tell Wanderly where you're going and how long
            you're staying. Get a practical day-by-day travel plan.
          </p>
        </div>

        <div className="itinerary-content">
          <form
            className="itinerary-form"
            onSubmit={handleGenerate}
          >
            <div className="itinerary-field">
              <label htmlFor="destination">
                Destination
              </label>

              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(event) =>
                  setDestination(event.target.value)
                }
                placeholder="e.g. Tokyo, Japan"
                disabled={loading}
              />
            </div>

            <div className="itinerary-field">
              <label htmlFor="days">
                Number of days
              </label>

              <select
                id="days"
                value={days}
                onChange={(event) =>
                  setDays(Number(event.target.value))
                }
                disabled={loading}
              >
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
                <option value={4}>4 days</option>
                <option value={5}>5 days</option>
                <option value={7}>7 days</option>
              </select>
            </div>

            <button
              type="submit"
              className="generate-itinerary-button"
              disabled={loading}
            >
              {loading
                ? "Creating your itinerary..."
                : "Generate itinerary"}
              <span>→</span>
            </button>
          </form>

          {error && (
            <div className="itinerary-error" role="alert">
              {error}
            </div>
          )}

          {itinerary && (
            <div className="itinerary-result">
              <div className="itinerary-result-heading">
                <p className="section-eyebrow">
                  YOUR WANDERLY PLAN
                </p>

                <h3>{itinerary.destination}</h3>

                <p>{itinerary.summary}</p>
              </div>

              <div className="itinerary-days">
                {itinerary.days.map((day) => (
                  <article
                    className="itinerary-day"
                    key={day.day}
                  >
                    <div className="day-number">
                      <span>DAY</span>
                      <strong>
                        {String(day.day).padStart(2, "0")}
                      </strong>
                    </div>

                    <div className="day-content">
                      <h4>{day.title}</h4>

                      <div className="day-activities">
                        {day.activities?.map(
                          (activity, index) => (
                            <div
                              className="activity"
                              key={`${activity.title}-${index}`}
                            >
                              <span className="activity-time">
                                {activity.time}
                              </span>

                              <div>
                                <h5>{activity.title}</h5>
                                <p>
                                  {activity.description}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ItineraryGenerator;