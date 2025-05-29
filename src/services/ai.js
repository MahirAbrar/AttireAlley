export const getAiClothSuggestions = async (userColors) => {
  const response = await fetch("/api/ai/cloth-suggestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userColors }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch AI suggestions.");
  }

  return response.json();
};
