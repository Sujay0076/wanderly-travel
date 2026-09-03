const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function askGemini(prompt) {
  if (!API_KEY) {
    throw new Error("Gemini API key is missing.");
  }

  if (!prompt || !prompt.trim()) {
    throw new Error("Please enter a message.");
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        model: "gemini-3.8-flash",
        input: prompt,
        generation_config: {
          thinking_level: "low",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.error?.message ||
        `Gemini request failed with status ${response.status}.`
    );
  }

  const data = await response.json();

  const text = data?.steps
    ?.filter((step) => step.type === "model_output")
    ?.flatMap((step) => step.content || [])
    ?.find((content) => content.type === "text")
    ?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}