import Cookies from "js-cookie";
import { useContext } from "react";

export const getCartItems = async (userID) => {
  try {
    const response = await fetch(`/api/cart/all-cart-items?userID=${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await response.json();

    if (data.isExpired) {
      return { isExpired: true };
    }

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Network response was not ok from get cart items service",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (e) {
    console.log("Error in get cart items service", e);
    return {
      success: false,
      message: e.message,
    };
  }
};
