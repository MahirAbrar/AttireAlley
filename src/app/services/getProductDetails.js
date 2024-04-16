import Cookies from "js-cookie";

// Frontend will send to Backend API to fetch a single product
export const getProductDetails = async (productId) => {
  try {
    const response = await fetch(
      `/api/client/get-product-details?productId=${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`, // Include if authentication is needed
        },
      },
    );

    const data = await response.json();
    console.log("Success fetching product in services/products");

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Network response was not ok from services/products",
      };
    }

    return { success: true, data };
  } catch (e) {
    console.log("Error fetching product in services/products", e);
    return { success: false, message: e.message };
  }
};
