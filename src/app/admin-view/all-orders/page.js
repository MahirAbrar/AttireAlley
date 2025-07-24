"use client";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";
import LoaderBig from "@/components/LoaderBig";
import { getAllOrders, updateOrderStatus } from "@/services/adminOrder";
import { toast } from "react-toastify";
import Breadcrumbs from "@/components/Breadcrumbs";
import ConfirmationModal from "@/components/ConfirmationModal";

const AllOrders = () => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    orderId: null,
    currentStatus: "",
    newStatus: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const ordersPerPage = 10;

  useEffect(() => {
    if (isAuthUser !== null) {
      if (!isAuthUser || user?.role !== "admin") {
        router.push("/some-other-route");
      } else {
        fetchOrders();
      }
    }
  }, [isAuthUser, user, router]);

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

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Status filter
      if (statusFilter !== "all" && order.orderStatus !== statusFilter)
        return false;

      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          order._id.toLowerCase().includes(search) ||
          order.user.name.toLowerCase().includes(search) ||
          order.user.email.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return b.totalPrice - a.totalPrice;
        case "lowest":
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

  const handleStatusClick = (orderId, currentStatus, newStatus) => {
    setStatusModal({
      isOpen: true,
      orderId,
      currentStatus,
      newStatus,
    });
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await updateOrderStatus(
        statusModal.orderId,
        statusModal.newStatus
      );
      if (response?.success) {
        toast.success("Order status updated successfully");
        fetchOrders(); // Refresh the orders
        setStatusModal({
          isOpen: false,
          orderId: null,
          currentStatus: "",
          newStatus: "",
        });
      } else {
        toast.error(response?.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusCancel = () => {
    setStatusModal({
      isOpen: false,
      orderId: null,
      currentStatus: "",
      newStatus: "",
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "paid":
        return "badge-info";
      case "confirmed":
        return "badge-info";
      case "processing":
        return "badge-primary";
      case "shipped":
        return "badge-secondary";
      case "delivered":
        return "badge-success";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderBig />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          customPaths={{
            "/admin-view": "Admin Dashboard",
            "/admin-view/all-orders": "All Orders",
          }}
        />

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Orders</h1>
          <button
            onClick={() => router.push("/admin-view")}
            className="btn btn-outline"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Orders
            </p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pending Orders
            </p>
            <p className="text-2xl font-bold text-warning">
              {
                orders.filter(
                  (o) => o.orderStatus === "pending" || o.orderStatus === "paid"
                ).length
              }
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Processing
            </p>
            <p className="text-2xl font-bold text-info">
              {orders.filter((o) => o.orderStatus === "processing").length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </p>
            <p className="text-2xl font-bold text-success">
              {orders.filter((o) => o.orderStatus === "delivered").length}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Search</label>
              <input
                type="text"
                placeholder="Order ID, name, or email..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                className="select select-bordered w-full"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Sort By</label>
              <select
                className="select select-bordered w-full"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Value</option>
                <option value="lowest">Lowest Value</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setSortBy("newest");
                  setCurrentPage(1);
                }}
                className="btn btn-outline w-full"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-800">
            <svg
              className="mx-auto mb-4 h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-gray-100">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Orders will appear here when customers make purchases"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="font-semibold">Order ID</th>
                    <th className="font-semibold">Date</th>
                    <th className="font-semibold">Customer</th>
                    <th className="font-semibold">Items</th>
                    <th className="font-semibold">Total</th>
                    <th className="font-semibold">Status</th>
                    <th className="font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td>
                        <div>
                          <p className="font-mono font-medium">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">{order._id}</p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-xs text-gray-500">
                            {order.user.email}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <p className="font-medium">
                            {order.orderItems.reduce(
                              (acc, item) => acc + item.quantity,
                              0
                            )}
                          </p>
                          <p className="text-xs text-gray-500">items</p>
                        </div>
                      </td>
                      <td className="font-semibold">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td>
                        <div className="dropdown dropdown-end">
                          <label
                            tabIndex={0}
                            className={`badge ${getStatusBadgeColor(order.orderStatus || "pending")} cursor-pointer`}
                          >
                            {order.orderStatus || "pending"}
                          </label>
                          <ul
                            tabIndex={0}
                            className="menu dropdown-content z-50 w-52 rounded-box bg-base-100 p-2 shadow"
                          >
                            {order.orderStatus !== "pending" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleStatusClick(
                                      order._id,
                                      order.orderStatus,
                                      "pending"
                                    )
                                  }
                                >
                                  Pending
                                </a>
                              </li>
                            )}
                            {order.orderStatus !== "paid" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleStatusClick(
                                      order._id,
                                      order.orderStatus,
                                      "paid"
                                    )
                                  }
                                >
                                  Paid
                                </a>
                              </li>
                            )}
                            {order.orderStatus !== "confirmed" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleStatusClick(
                                      order._id,
                                      order.orderStatus,
                                      "confirmed"
                                    )
                                  }
                                >
                                  Confirmed
                                </a>
                              </li>
                            )}
                            {order.orderStatus !== "processing" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleStatusClick(
                                      order._id,
                                      order.orderStatus,
                                      "processing"
                                    )
                                  }
                                >
                                  Processing
                                </a>
                              </li>
                            )}
                            {order.orderStatus !== "shipped" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleStatusClick(
                                      order._id,
                                      order.orderStatus,
                                      "shipped"
                                    )
                                  }
                                >
                                  Shipped
                                </a>
                              </li>
                            )}
                            {order.orderStatus !== "delivered" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleStatusClick(
                                      order._id,
                                      order.orderStatus,
                                      "delivered"
                                    )
                                  }
                                >
                                  Delivered
                                </a>
                              </li>
                            )}
                            {order.orderStatus !== "cancelled" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleStatusClick(
                                      order._id,
                                      order.orderStatus,
                                      "cancelled"
                                    )
                                  }
                                >
                                  Cancelled
                                </a>
                              </li>
                            )}
                          </ul>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            router.push(
                              `/admin-view/order-details/${order._id}`
                            )
                          }
                          className="btn btn-primary btn-sm"
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>
            <div className="btn-group">
              <button
                className="btn btn-sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? "btn-active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )
              ) : (
                <>
                  {currentPage > 2 && (
                    <>
                      <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </button>
                      {currentPage > 3 && (
                        <button className="btn btn-disabled btn-sm">...</button>
                      )}
                    </>
                  )}
                  {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                    .filter((page) => page > 0 && page <= totalPages)
                    .map((page) => (
                      <button
                        key={page}
                        className={`btn btn-sm ${currentPage === page ? "btn-active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && (
                        <button className="btn btn-disabled btn-sm">...</button>
                      )}
                      <button
                        className="btn btn-sm"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </>
              )}
              <button
                className="btn btn-sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Status Update Confirmation Modal */}
        <ConfirmationModal
          isOpen={statusModal.isOpen}
          onClose={handleStatusCancel}
          onConfirm={handleStatusUpdate}
          title="Update Order Status"
          message={`Are you sure you want to change the order status from "${statusModal.currentStatus}" to "${statusModal.newStatus}"?`}
          confirmText="Update Status"
          cancelText="Cancel"
          confirmButtonClass="btn-primary"
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
};

export default AllOrders;
