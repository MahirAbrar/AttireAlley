import Cookies from "js-cookie";

// requires product ID
// requires user ID
// requires quantity

// Frontend service function to add a product to the cart
export const addToCart = async (data) => {
  const formData = {
    productID: data.productID,
    userID: data.userID,
    quantity: data.quantity,
  };

  try {
    const response = await fetch("/api/cart/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Network response was not ok from add to cart service",
      };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, message: e.message };
  }
};
