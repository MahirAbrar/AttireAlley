import Cookies from "js-cookie";

// Frontend will send to Backend API to delete a product
export const deleteProduct = async (productId) => {
  console.log("deleting from services");
  try {
    const response = await fetch(`/api/admin/delete-product?id=${productId}`, {
      // Assuming ID is passed as a URL parameter
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await response.json();
    console.log("Attempted to delete product in services/products");

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Failed to delete product from services/products",
      };
    }

    return { success: true, data };
  } catch (e) {
    console.log("Error deleting product in services/products", e);
    return { success: false, message: e.message };
  }
};
