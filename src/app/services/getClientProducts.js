import Cookies from "js-cookie";

// Frontend will send to Backend API to fetch products
export const getClientProducts = async (cat) => {
  try {
    const response = await fetch(
      `/api/client/get-client-product?category=${cat}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    console.log("Success fetching products in services/products");

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Network response was not ok from services/products",
      };
    }

    return { success: true, data };
  } catch (e) {
    console.log("Error fetching products in services/products", e);
    return { success: false, message: e.message };
  }
};
