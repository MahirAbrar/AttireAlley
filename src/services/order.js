import Cookies from "js-cookie";

// TODO: Eslint
// TODO 9 11 40
// TODO Need to hook up with frontend
// Need to do order processing logic
export const createNewOrder = async (formData) => {
  try {
    const res = await fetch("/api/order/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllOrdersForUser = async (id) => {
  try {
    const res = await fetch(`/api/order/get-order?userID=${id}`, {
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

export const getOrderDetails = async (id) => {
  try {
    const res = await fetch(`/api/order/order-details?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllOrdersForAllUsers = async () => {
  try {
    const res = await fetch(`/api/admin/orders/get-all-orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const updateStatusOfOrder = async (formData) => {
  try {
    const res = await fetch(`/api/admin/orders/update-order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};
