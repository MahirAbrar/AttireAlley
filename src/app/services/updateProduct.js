import Cookies from "js-cookie";

// Frontend will send to Backend API to update a product
export const updateProduct = async (productId, productData) => {
  console.log("sending from services");
  productData.id = productId;
  console.log(productData);
  try {
    const response = await fetch(`/api/admin/update-product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    console.log("Attempted to update product in services/products");

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Failed to update product from services/products",
      };
    }

    return { success: true, data };
  } catch (e) {
    console.log("Error updating product in services/products", e);
    return { success: false, message: e.message };
  }
};
