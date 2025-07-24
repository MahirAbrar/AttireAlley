"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";
import LoaderBig from "@/components/LoaderBig";
import { getOrderDetails, updateOrderStatus } from "@/services/adminOrder";
import Image from "next/image";
import { toast } from "react-toastify";

const OrderDetails = ({ params }) => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [showTrackingInput, setShowTrackingInput] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await getOrderDetails(params.orderId);
      if (response?.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    if (isAuthUser !== null) {
      if (!isAuthUser || user?.role !== "admin") {
        router.push("/some-other-route");
      } else {
        fetchOrderDetails();
      }
    }
  }, [isAuthUser, user, router, fetchOrderDetails]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await updateOrderStatus(
        order._id, 
        newStatus, 
        newStatus === "shipped" ? trackingNumber : null,
        statusNote || null
      );
      if (response?.success) {
        toast.success("Order status updated successfully");
        fetchOrderDetails(); // Refresh the order
        setTrackingNumber("");
        setStatusNote("");
        setShowTrackingInput(false);
      } else {
        toast.error(response?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending": return "badge-warning";
      case "paid": return "badge-info";
      case "confirmed": return "badge-info";
      case "processing": return "badge-primary";
      case "shipped": return "badge-secondary";
      case "delivered": return "badge-success";
      case "cancelled": return "badge-error";
      default: return "badge-ghost";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderBig />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <button 
            onClick={() => router.push("/admin-view")}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <p><span className="font-semibold">Order ID:</span> {order._id}</p>
              <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><span className="font-semibold">Order Status:</span> 
                <span className={`ml-2 badge ${getStatusBadgeColor(order.orderStatus || 'pending')}`}>
                  {order.orderStatus || 'pending'}
                </span>
              </p>
              {order.trackingNumber && (
                <p><span className="font-semibold">Tracking Number:</span> {order.trackingNumber}</p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <p><span className="font-semibold">Name:</span> {order.user.name}</p>
              <p><span className="font-semibold">Email:</span> {order.user.email}</p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Full Name:</span> {order.shippingAddress.fullName}</p>
              <p><span className="font-semibold">Address:</span> {order.shippingAddress.address}</p>
            </div>
            <div>
              <p><span className="font-semibold">City:</span> {order.shippingAddress.city}</p>
              <p><span className="font-semibold">Country:</span> {order.shippingAddress.country}</p>
              <p><span className="font-semibold">Postal Code:</span> {order.shippingAddress.postalCode}</p>
            </div>
          </div>
        </div>

        {/* Status Update Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["pending", "paid", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    if (status === "shipped") {
                      setShowTrackingInput(true);
                    } else {
                      handleStatusUpdate(status);
                    }
                  }}
                  disabled={order.orderStatus === status}
                  className={`btn btn-sm ${order.orderStatus === status ? 'btn-disabled' : 'btn-outline'}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {showTrackingInput && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="input input-bordered w-full"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate("shipped")}
                    className="btn btn-primary"
                    disabled={!trackingNumber}
                  >
                    Update to Shipped
                  </button>
                  <button
                    onClick={() => {
                      setShowTrackingInput(false);
                      setTrackingNumber("");
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div>
              <textarea
                placeholder="Add a note (optional)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="textarea textarea-bordered w-full"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Status History</h2>
            <div className="space-y-3">
              {order.statusHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((history, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className={`badge ${getStatusBadgeColor(history.status)}`}>
                    {history.status}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      {new Date(history.timestamp).toLocaleString()}
                    </p>
                    {history.note && (
                      <p className="text-sm mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item._id} className="flex items-center border-b pb-4">
                <div className="w-20 h-20 relative mr-4 bg-gray-100 rounded">
                  {item.productID.imageURL ? (
                    <Image
                      src={Array.isArray(item.productID.imageURL) 
                        ? item.productID.imageURL[0] 
                        : item.productID.imageURL}
                      alt={item.productID.name}
                      fill
                      className="object-cover rounded"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={true}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.productID.name}</h3>
                  <p className="text-sm text-gray-600">Category: {item.productID.category}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.productID.price * item.quantity}</p>
                  <p className="text-sm text-gray-600">${item.productID.price} each</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total Amount</span>
              <span className="text-xl font-semibold">${order.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 