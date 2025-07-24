import { fetchWithAuth } from "@/utils/fetchWithAuth";
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

// The Timeout Problem You're Experiencing:

//   The issue where "the thing times out but you don't get logged out"
//   happens because:

//   1. Token expiration is only checked in the Navbar component when
//   fetching cart items (lines 75-90)
//   2. Most API calls don't handle token expiration, so expired tokens go
//   unnoticed
//   3. No global interceptor to catch expired tokens across all API requests
//   4. The logout only happens in specific flows, not automatically when any
//    API call detects an expired token

//   Critical Security Vulnerabilities Found:

//   1. CRITICAL: Hardcoded JWT Secret
//     - "default_secret_key" is hardcoded as fallback
//     - Anyone can forge valid tokens with this known secret
//   2. No Token Revocation
//     - Tokens remain valid until expiration
//     - No server-side session invalidation
//     - Logout only clears client-side cookie
//   3. Weak Password Requirements
//     - Only 6 characters minimum
//     - No complexity requirements
//   4. Missing Security Features
//     - No CSRF protection
//     - No account lockout mechanism
//     - No audit logging
//     - No MFA support

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
    return { success: false, message: "Failed to create order", error: e };
  }
};

export const getAllOrdersForUser = async (id) => {
  const data = await fetchWithAuth(`/api/order/get-order?userID=${id}`, {
    method: "GET",
  });
  return data;
};

export const getOrderDetails = async (id) => {
  const data = await fetchWithAuth(`/api/order/order-details?id=${id}`, {
    method: "GET",
  });
  return data;
};

export const getAllOrdersForAllUsers = async () => {
  const data = await fetchWithAuth(`/api/admin/orders/get-all-orders`, {
    method: "GET",
  });
  return data;
};

export const updateStatusOfOrder = async (formData) => {
  const data = await fetchWithAuth(`/api/admin/orders/update-order`, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
  return data;
};
