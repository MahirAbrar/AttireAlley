"use client";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";
import LoaderBig from "@/components/LoaderBig";
import { getAllOrders } from "@/services/adminOrder";
import Image from "next/image";

const AllOrders = () => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const ordersPerPage = 10;

  useEffect(() => {
    if (isAuthUser !== null) {
      if (!isAuthUser || user?.role !== "admin") {
        router.push("/some-other-route");
      } else {
        fetchOrders();
      }
    }
  }, [isAuthUser, user]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      if (response?.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (statusFilter === "all") return true;
    if (statusFilter === "paid") return order.isPaid;
    if (statusFilter === "pending") return !order.isPaid;
    if (statusFilter === "processing") return order.isProcessing;
    if (statusFilter === "completed") return !order.isProcessing;
    return true;
  });

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderBig />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Orders</h1>
          <button 
            onClick={() => router.push("/admin-view")}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <select 
            className="select select-bordered bg-inherit dark:bg-backgroundDark"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Orders</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="font-mono">{order._id.slice(-6)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.user.name}</td>
                    <td>{order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-error'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                        <span className={`badge ${order.isProcessing ? 'badge-warning' : 'badge-success'}`}>
                          {order.isProcessing ? 'Processing' : 'Completed'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => router.push(`/admin-view/order-details/${order._id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="btn-group">
              <button
                className="btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? 'btn-active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders; 