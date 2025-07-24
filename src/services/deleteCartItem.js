import Cookies from "js-cookie";

export const deleteCartItem = async (userID, productID) => {
  try {
    const response = await fetch(
      `/api/cart/delete-from-cart?userID=${userID}&productID=${productID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      },
    );

    const data = await response.json();

    if (data.isExpired) {
      return { isExpired: true };
    }

    if (!response.ok) {
      // Check for specific error messages from the backend
      if (data.message === "Unauthorized") {
        return { unauthorized: true, message: data.message };
      } else if (data.message === "User not found") {
        return { userNotFound: true, message: data.message };
      } else if (data.message === "Cart item not found") {
        return { cartItemNotFound: true, message: data.message };
      } else {
        return {
          success: false,
          message:
            data.message ||
            "Network response was not ok from delete cart item service",
        };
      }
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (e) {
    return {
      success: false,
      message: e.message,
    };
  }
};
