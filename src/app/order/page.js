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

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await getAllOrdersForUser(user._id);
        if (response.success) {
          setOrders(response.data);
        } else {
          console.error("Error fetching orders:", response.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthUser, user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      
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
          <p className="text-xl text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h2>
                  <p className="text-gray-600">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total: ${order.totalPrice.toFixed(2)}
                  </p>
                  <p className={`text-sm ${
                    order.isProcessing ? "text-yellow-600" : "text-green-600"
                  }`}>
                    Status: {order.isProcessing ? "Processing" : "Completed"}
                  </p>
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
