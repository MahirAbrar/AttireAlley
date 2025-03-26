export async function getClientProducts(category) {
  try {
    // Use absolute URL with the current host
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/client/get-client-product?category=${category}`,
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
