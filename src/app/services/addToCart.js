import Cookies from "js-cookie";

// requires product ID
// requires user ID
// requires quantity

// Frontend service function to add a product to the cart
export const addToCart = async (productID, userID, quantity) => {
  try {
    const formData = {
      productID: productID,
      userID: userID,
      quantity: quantity,
    };

    console.log("Adding item to cart", JSON.stringify(formData));

    const response = await fetch("/api/cart/add-to-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Response from add to cart", data);

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
    console.log("Error in add to cart service", e);
    return { success: false, message: e.message };
  }
};
