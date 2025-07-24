export async function getClientProducts(category) {
  try {
    // In production, we want to use the same origin
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    const response = await fetch(
      `${baseUrl}/api/client/get-client-product?category=${category}`,
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ["products"],
        },
        cache: 'no-store', // Don't cache during build
      },
    );

    if (!response.ok) {
      console.error("API response not OK:", response.status, response.statusText);
      return {
        success: false,
        message: `API request failed: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: error.message,
      error: error,
    };
  }
}
