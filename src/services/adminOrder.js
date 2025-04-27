import Cookies from "js-cookie";

export const getAllOrders = async () => {
  try {
    const res = await fetch("/api/admin/orders/get-all-orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return { success: false, message: "Failed to fetch orders" };
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const res = await fetch(`/api/admin/orders/get-order-details?orderId=${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return { success: false, message: "Failed to fetch order details" };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await fetch("/api/admin/orders/update-order", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ orderId, status }),
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    return { success: false, message: "Failed to update order status" };
  }
}; 