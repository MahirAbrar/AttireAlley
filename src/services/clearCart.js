import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const clearCart = async (userId) => {
  try {
    const response = await fetchWithAuth(`/api/cart/clear-cart`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    return response;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      message: error.message || "Failed to clear cart",
    };
  }
};