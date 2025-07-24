import Cookies from "js-cookie";

// Frontend will send to Backend API to delete a product
export const deleteProduct = async (productId, userID) => {
  try {
    const response = await fetch(`/api/admin/delete-product?id=${productId}&userID=${userID}`, {
      method: "DELETE",
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
          data.message || "Failed to delete product from services/products",
      };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, message: e.message };
  }
};
