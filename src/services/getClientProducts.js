const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_PREFIX = "aa:products:v1:";

function readCache(category) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + category);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || typeof entry.ts !== "number" || !entry.payload) return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) return null;
    return entry.payload;
  } catch {
    return null;
  }
}

function writeCache(category, payload) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CACHE_PREFIX + category,
      JSON.stringify({ ts: Date.now(), payload })
    );
  } catch {
    // quota / private mode — ignore
  }
}

export async function getClientProducts(category) {
  const cached = readCache(category);
  if (cached) {
    return { success: true, data: cached, fromCache: true };
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");

    const response = await fetch(
      `${baseUrl}/api/client/get-client-product?category=${category}`,
      {
        next: { revalidate: 86400, tags: ["products"] },
      }
    );

    if (!response.ok) {
      console.error("API response not OK:", response.status, response.statusText);
      return {
        success: false,
        message: `API request failed: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    writeCache(category, data);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, message: error.message, error };
  }
}
