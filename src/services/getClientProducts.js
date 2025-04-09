export async function getClientProducts(category) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    console.log("Fetching products from:", `${baseUrl}/api/client/get-client-product?category=${category}`);
    
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

    if (!response.ok) {
      console.error("API response not OK:", response.status, response.statusText);
      return {
        success: false,
        message: `API request failed: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log("Products fetched successfully:", data);

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
