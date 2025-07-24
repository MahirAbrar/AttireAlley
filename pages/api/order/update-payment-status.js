import connectToDB from "@/database";
import Order from "@/models/order";
import User from "@/models/user";
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
    const user = await AuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { userId, sessionId } = req.body;

    // Verify the user is updating their own order
    if (user._id !== userId && user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    await connectToDB();

    // Find the most recent unpaid order for this user
    const order = await Order.findOne({
      user: userId,
      isPaid: false,
      isProcessing: true
    }).sort({ createdAt: -1 });

    if (!order) {
      console.log("No unpaid order found for user:", userId);
      return res.status(404).json({
        success: false,
        message: "No unpaid order found",
      });
    }

    // Update the order as paid
    order.isPaid = true;
    order.paidAt = new Date();
    order.isProcessing = false;
    order.orderStatus = "paid";
    order.stripeSessionId = sessionId;

    // Add to status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status: "paid",
      timestamp: new Date(),
      note: `Payment confirmed. Session ID: ${sessionId}`,
    });

    await order.save();

    console.log(`Order ${order._id} marked as paid via checkout redirect`);

    // Clear user's cart
    const userDoc = await User.findById(userId);
    if (userDoc) {
      userDoc.cart = [];
      await userDoc.save();
      console.log(`Cart cleared for user ${userId}`);
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
}

export default withApiMiddleware(handler);