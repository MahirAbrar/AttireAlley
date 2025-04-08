import { NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

// Cache configuration
const CACHE_DURATION = 3600; // Cache for 1 hour in seconds

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new NextResponse("Method not allowed", { status: 405 });
    }

    const body = await req.json();

    // Create a cache key based on the prompt
    const cacheKey = JSON.stringify(body.prompt);

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that provides clothing suggestions",
            },
            {
              role: "user",
              content: body.prompt,
            },
          ],
          stream: false,
        }),
        // Add caching configuration
        next: {
          revalidate: CACHE_DURATION,
          tags: [`cloth-suggestion-${cacheKey}`],
        },
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
