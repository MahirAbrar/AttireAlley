import Cookies from "js-cookie";
import { AuthUser } from "@/middleware/AuthUser";

// Frontend service function to add a product to the cart
export const addToCart = async (productID, userID, quantity) => {
  const isAuthUser = await AuthUser(`Bearer ${Cookies.get("token")}`);

  if (!isAuthUser) {
    return {
      success: false,
      message: "User is not authenticated",
    };
  }

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
