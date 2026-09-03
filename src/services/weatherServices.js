const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getCurrentWeather(latitude, longitude) {
  if (!API_KEY) {
    throw new Error("OpenWeather API key is missing.");
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?lat=${latitude}` +
    `&lon=${longitude}` +
    `&appid=${API_KEY}` +
    `&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Unable to fetch weather data."
    );
  }

  return response.json();
}