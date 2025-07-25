import Cookies from "js-cookie";

// Frontend will send to Backend API to fetch products
export const getProducts = async () => {
  try {
    const response = await fetch("/api/admin/get-products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Network response was not ok from services/products",
      };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, message: e.message };
  }
};
