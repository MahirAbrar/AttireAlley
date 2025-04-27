"use client";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";
import LoaderBig from "@/components/LoaderBig";
import { getAllOrdersForAllUsers } from "@/services/order";

const AdminView = () => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (isAuthUser !== null) {
      if (!isAuthUser || user?.role !== "admin") {
        router.push("/some-other-route");
      } else {
        setLoading(false);
        fetchOrders();
      }
    }
  }, [isAuthUser, user]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrdersForAllUsers();
      if (response?.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-primary">{orders.length}</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-primary">$0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Product Management</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/admin-view/add-product')}
                className="btn btn-primary w-full"
              >
                Add New Product
              </button>
              <button 
                onClick={() => router.push('/admin-view/all-products')}
                className="btn btn-primary w-full"
              >
                Manage Products
              </button>
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Order Management</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/admin-view/all-orders')}
                className="btn btn-primary w-full"
              >
                View All Orders
              </button>
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <div className="space-y-3">
              <button className="btn btn-primary w-full">
                View All Users
              </button>
              <button className="btn btn-primary w-full">
                Manage Users
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <div className="p-6 rounded-lg shadow-lg">
            {ordersLoading ? (
              <div className="flex justify-center">
                <LoaderBig />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div 
                    key={order._id} 
                    className="border-b pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => router.push(`/admin-view/order-details/${order._id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.totalPrice}</p>
                        <p className={`text-sm ${
                          order.isPaid ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        Items: {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders to display</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
