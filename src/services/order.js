import Cookies from "js-cookie";

// Landing apge
// TODO: featured collection images
// Critical (Fix Immediately):
// 1. ✅ Hardcoded JWT secret
// 2. ✅ Exposed credentials in .env.local
// 3. ❌ JWT in localStorage (move to httpOnly cookies)
// 4. ❌ No rate limiting on auth endpoints

// High Priority:
// 1. ❌ File upload validation
// 2. ❌ Stripe webhook verification
// 3. ❌ Security headers implementation
// 4. ❌ Input validation on all endpoints

// Medium Priority:
// 1. ❌ API versioning
// 2. ❌ Request logging
// 3. ❌ Token refresh mechanism
// 4. ❌ Content Security Policy

// TODO: Eslint
// TODO 9 11 40
// TODO Need to hook up with frontend
// TODO: Delete all clothes and add new specific clothes
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
