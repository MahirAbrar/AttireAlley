"use client";

import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";
import { getOrderDetails } from "@/services/order";
import LoaderBig from "@/components/LoaderBig";
import Image from "next/image";
import Link from "next/link";

const OrderDetailsPage = ({ params }) => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (isAuthUser === false) {
      router.push("/login");
    } else if (isAuthUser && user && params.orderId) {
      fetchOrderDetails();
    }
  }, [isAuthUser, user, params.orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderDetails(params.orderId);
      if (response?.success) {
        setOrder(response.data);
      } else {
        console.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
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

  if (!order) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Order not found</p>
          <Link href="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Link href="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Order ID:</span> #{order._id.slice(-8).toUpperCase()}</p>
                <p><span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}</p>
                <p><span className="font-medium">Order Status:</span> 
                  <span className={`ml-2 badge ${getStatusBadgeColor(order.orderStatus || 'pending')}`}>
                    {order.orderStatus || 'pending'}
                  </span>
                </p>
                {order.trackingNumber && (
                  <p><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.additionalDetails && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.additionalDetails}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>
            <div className="space-y-4">
              {order.statusHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((history, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'} flex items-center justify-center`}>
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${getStatusBadgeColor(history.status)}`}>
                        {history.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(history.timestamp)}
                      </span>
                    </div>
                    {history.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {history.note}
                      </p>
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
              <div key={item._id} className="flex items-center space-x-4 pb-4 border-b last:border-0">
                <div className="w-20 h-20 relative bg-gray-100 rounded">
                  {item.productID?.imageURL ? (
                    <Image
                      src={Array.isArray(item.productID.imageURL) 
                        ? item.productID.imageURL[0] 
                        : item.productID.imageURL}
                      alt={item.productID?.name || 'Product'}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.productID?.name || 'Product'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${((item.productID?.price || 0) * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${item.productID?.price || 0} each
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total:</span>
              <span className="font-bold text-xl">${order.totalPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Status:</span>
              <span className={`badge ${getStatusBadgeColor(order.orderStatus || 'pending')}`}>
                {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Payment:</span>
              <span className="text-green-600 font-medium">Paid</span>
            </div>
            {order.statusHistory && order.statusHistory.length > 0 && (() => {
              const latestStatus = order.statusHistory.sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
              )[0];
              return latestStatus.note ? (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Note:</span> {latestStatus.note}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;