import OpenAI from "openai";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userColors } = req.body;

  if (
    !userColors ||
    !userColors.eyeColor ||
    !userColors.hairColor ||
    !userColors.skinColor
  ) {
    return res.status(400).json({
      error: "Missing eyeColor, hairColor, or skinColor in request body",
    });
  }

  const prompt = `Given the eye color (${userColors.eyeColor}), hair color (${userColors.hairColor}), and skin color (${userColors.skinColor}) of this person, give at 10 different combinations of cloth colors that would suit them the most. The format would be like this:
  - Blue shirt, black pants, white shoes
  - Red shirt, blue pants, black shoes, black hat
  You can include any jewelry, accessories, or other items that would suit the person.
  Do not mention anything else, just the combinations.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      n: 1,
      temperature: 0.7,
    });

    const suggestions = completion.choices[0]?.message?.content?.trim();

    if (!suggestions) {
      return res
        .status(500)
        .json({ error: "Failed to get suggestions from AI" });
    }

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    let errorMessage = "Failed to get suggestions from AI.";
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error.message || errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
}

export default withApiMiddleware(handler);
