import Cookies from "js-cookie";
// import { GlobalContext } from "@/context/index";
import { useContext } from "react";

export const getCartItems = async (userID) => {
  // const { isAuthUser } = useContext(GlobalContext);

  // if (!isAuthUser()) {
  //   return {
  //     success: false,
  //     message: "User is not authenticated",
  //   };
  // }

  try {
    const response = await fetch(`/api/cart/all-cart-items?userID=${userID}`, {
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
