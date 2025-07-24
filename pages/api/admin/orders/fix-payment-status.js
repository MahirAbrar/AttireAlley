import connectToDB from "@/database";
import Order from "@/models/order";
import AuthUser from "@/middleware/AuthUser";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

async function handler(req, res) {
  if (req.method !== "POST") {
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

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
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

    // Check if order has a stripeSessionId
    if (order.stripeSessionId) {
      // This means payment was likely successful
      order.isPaid = true;
      order.paidAt = order.paidAt || new Date();
      order.orderStatus = order.orderStatus === "pending" ? "paid" : order.orderStatus;
      
      // Add to status history if not already there
      const hasPaidStatus = order.statusHistory?.some(h => h.status === "paid");
      if (!hasPaidStatus) {
        if (!order.statusHistory) {
          order.statusHistory = [];
        }
        order.statusHistory.push({
          status: "paid",
          timestamp: new Date(),
          note: "Payment status manually verified by admin",
        });
      }
      
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment status fixed",
        data: order,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Order does not have a Stripe session ID. Cannot verify payment.",
      });
    }
  } catch (e) {
    console.error("Error in fixing payment status:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: e.message,
    });
  }
}

export default withApiMiddleware(handler);