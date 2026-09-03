const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export async function searchImages(query, perPage = 5) {
  if (!API_KEY) {
    throw new Error("Pexels API key is missing.");
  }

  if (!query || !query.trim()) {
    throw new Error("Please enter an image search query.");
  }

  const url =
    `https://api.pexels.com/v1/search` +
    `?query=${encodeURIComponent(query.trim())}` +
    `&per_page=${perPage}` +
    `&orientation=landscape`;

  const response = await fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.error ||
        `Pexels request failed with status ${response.status}.`
    );
  }

  const data = await response.json();

  if (!data.photos || data.photos.length === 0) {
    throw new Error("No images found for this destination.");
  }

  return data.photos;
}