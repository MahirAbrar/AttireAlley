export async function getClientProducts(category) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    // Use the complete URL for server-side requests
    const response = await fetch(
      `${baseUrl}/api/client/get-client-product?category=${category}`,
      {
        // Option 1: Remove no-store and use revalidate
        next: { revalidate: 3600 }, // revalidate every hour

        // OR Option 2: If you really need no-store, use this configuration
        // cache: 'no-store',
        // next: { tags: ['products'] }
      },
    );
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
    };
  }
}
