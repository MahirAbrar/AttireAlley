"use client";
import React, { useState, useEffect } from "react";
import { GlobalContext } from "@/context/index";
import { useContext } from "react";
import { getAllOrdersForUser } from "../../services/order";
import Loader from "@/components/Loader";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OrderPage = () => {
  const { isAuthUser, user } = useContext(GlobalContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAllOrdersForUser(user._id);
        if (response.success) {
          // Sort orders by date, newest first
          const sortedOrders = response.data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
        } else {
          setError(response.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("An error occurred while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthUser, user]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-focus transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {!isAuthUser ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600 mb-4">Please log in to view your orders.</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-focus transition-colors"
          >
            Login
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h2>
                  <p className="text-gray-600">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Payment Method: {order.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total: ${order.totalPrice.toFixed(2)}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      Status: <span className={`badge ${getStatusBadgeColor(order.orderStatus || 'pending')}`}>
                        {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Pending'}
                      </span>
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      Payment: Paid
                    </p>
                    {order.statusHistory && order.statusHistory.length > 0 && (() => {
                      const latestStatus = order.statusHistory.sort((a, b) => 
                        new Date(b.timestamp) - new Date(a.timestamp)
                      )[0];
                      return latestStatus.note ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          Note: {latestStatus.note}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Shipping Address:</h3>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.country}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                {order.shippingAddress.additionalDetails && (
                  <p className="text-gray-600">{order.shippingAddress.additionalDetails}</p>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Order Items:</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.productID.imageURL[0]}
                          alt={item.productID.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productID.name}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-600">
                          Price: $
                          {item.productID.onSale === "Yes"
                            ? (item.productID.price - item.productID.priceDrop).toFixed(2)
                            : item.productID.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
