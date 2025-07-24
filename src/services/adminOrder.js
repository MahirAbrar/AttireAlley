import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const getAllOrders = async () => {
  const data = await fetchWithAuth("/api/admin/orders/get-all-orders", {
    method: "GET",
  });
  return data;
};

export const getOrderDetails = async (orderId) => {
  const data = await fetchWithAuth(`/api/admin/orders/get-order-details?orderId=${orderId}`, {
    method: "GET",
  });
  return data;
};

export const updateOrderStatus = async (orderId, status, trackingNumber = null, note = null) => {
  const data = await fetchWithAuth("/api/admin/orders/update-order", {
    method: "PUT",
    body: JSON.stringify({ orderId, status, trackingNumber, note }),
  });
  return data;
}; 