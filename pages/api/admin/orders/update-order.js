import connectToDB from "@/database";
import Order from "@/models/order";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Verify admin user
    const user = await AuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, please log in.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden, admin access required.",
      });
    }

    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    await connectToDB();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        isProcessing: status === "processing",
        isPaid: status === "paid",
        paidAt: status === "paid" ? new Date() : null
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (e) {
    console.error("Error in updating order:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: e.message,
    });
  }
} 