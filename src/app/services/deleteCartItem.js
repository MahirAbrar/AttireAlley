import Cookies from "js-cookie";

export const deleteCartItem = async (userID, productID) => {
  try {
    console.log(userID, productID);
    const response = await fetch(
      `/api/cart/delete-cart-item?userID=${userID}&productID=${productID}`,
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
      return {
        success: false,
        message:
          data.message ||
          "Network response was not ok from delete cart item service",
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (e) {
    console.log("Error in delete cart item service", e);
    return {
      success: false,
      message: e.message,
    };
  }
};
