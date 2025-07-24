import connectToDB from "@/database";
import Order from "@/models/order";
import AuthUser from "@/middleware/AuthUser";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

async function handler(req, res) {
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

    const { orderId, status, trackingNumber, note } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    // Validate status
    const validStatuses = ["pending", "paid", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    await connectToDB();

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order status
    order.orderStatus = status;
    
    // Update related fields based on status
    if (status === "paid" && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }
    
    if (status === "processing" || status === "confirmed") {
      order.isProcessing = true;
    } else {
      order.isProcessing = false;
    }
    
    if (status === "shipped" && trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    // Add to status history
    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      note: note || `Status updated to ${status} by admin`,
    });

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
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

export default withApiMiddleware(handler);
