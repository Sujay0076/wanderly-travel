const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function searchLocation(city) {
  if (!API_KEY) {
    throw new Error("OpenWeather API key is missing.");
  }

  if (!city || !city.trim()) {
    throw new Error("Please enter a location.");
  }

  const url =
    `https://api.openweathermap.org/geo/1.0/direct` +
    `?q=${encodeURIComponent(city.trim())}` +
    `&limit=5` +
    `&appid=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Unable to search for this location."
    );
  }

  const locations = await response.json();

  if (!locations.length) {
    throw new Error("No matching location found.");
  }

  return locations;
}