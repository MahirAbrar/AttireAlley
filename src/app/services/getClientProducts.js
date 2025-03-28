export async function getClientProducts(category) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    // Use the complete URL for server-side requests
    const response = await fetch(
      `${baseUrl}/api/client/get-client-product?category=${category}`,
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ["products"], // Optional: for on-demand revalidation
          cache: "force-cache", // Use cache during build
        },
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
