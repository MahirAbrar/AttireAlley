import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const getCartItems = async (userID) => {
  const data = await fetchWithAuth(`/api/cart/all-cart-items?userID=${userID}`, {
    method: "GET",
  });

  if (data.success) {
    return {
      success: true,
      data: data.data,
    };
  }

  return data;
};
