"use client";

import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";
import { getAllOrdersForUser } from "@/services/order";
import LoaderBig from "@/components/LoaderBig";
import Link from "next/link";

const UserOrders = () => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isAuthUser === false) {
      router.push("/login");
    } else if (isAuthUser && user) {
      fetchOrders();
    }
  }, [isAuthUser, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrdersForUser(user._id);
      if (response?.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderBig />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link href="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start shopping to see your orders here!
            </p>
            <Link href="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <div className="flex items-center gap-3">
                      <span className={`badge ${getStatusBadgeColor(order.orderStatus || 'pending')}`}>
                        {order.orderStatus || 'pending'}
                      </span>
                      {order.trackingNumber && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Tracking: {order.trackingNumber}
                        </span>
                      )}
                    </div>
                    {order.statusHistory && order.statusHistory.length > 0 && (() => {
                      const latestStatus = order.statusHistory.sort((a, b) => 
                        new Date(b.timestamp) - new Date(a.timestamp)
                      )[0];
                      return latestStatus.note ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {latestStatus.note}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Order Status Progress - Only show for non-cancelled orders */}
                {order.orderStatus !== 'cancelled' && order.orderStatus !== 'pending' && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between">
                      {['paid', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
                        const isActive = ['paid', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) >= index;
                        const isCompleted = ['paid', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus) > index;
                        return (
                          <div key={status} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isActive ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                              }`}>
                                {isCompleted ? (
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <span className="text-xs">{index + 1}</span>
                                )}
                              </div>
                              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'text-gray-500'}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </div>
                            {index < 4 && (
                              <div className={`flex-1 h-0.5 ${
                                isCompleted ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">{item.productID?.name || 'Product'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          ${((item.productID?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Shipping to: {order.shippingAddress.city}, {order.shippingAddress.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-xl font-bold">${order.totalPrice}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => router.push(`/order-details/${order._id}`)}
                    className="btn btn-sm btn-outline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;