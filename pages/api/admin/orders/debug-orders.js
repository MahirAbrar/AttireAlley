import connectToDB from "@/database";
import Order from "@/models/order";
import AuthUser from "@/middleware/AuthUser";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

async function handler(req, res) {
  if (req.method !== "GET") {
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

    await connectToDB();

    // Get orders with payment issues
    const unpaidOrdersWithSession = await Order.find({
      isPaid: false,
      stripeSessionId: { $exists: true, $ne: null }
    }).populate("user", "name email");

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email")
      .select("_id isPaid orderStatus stripeSessionId createdAt user totalPrice");

    return res.status(200).json({
      success: true,
      message: "Debug information retrieved",
      data: {
        unpaidOrdersWithSession: unpaidOrdersWithSession.map(order => ({
          _id: order._id,
          user: order.user?.email,
          isPaid: order.isPaid,
          orderStatus: order.orderStatus,
          stripeSessionId: order.stripeSessionId,
          createdAt: order.createdAt,
          totalPrice: order.totalPrice
        })),
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          user: order.user?.email,
          isPaid: order.isPaid,
          orderStatus: order.orderStatus,
          stripeSessionId: order.stripeSessionId,
          createdAt: order.createdAt,
          totalPrice: order.totalPrice
        })),
        webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        stripeKey: !!process.env.STRIPE_SECRET_KEY
      }
    });
  } catch (e) {
    console.error("Error in debug orders:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve debug information",
      error: e.message,
    });
  }
}

export default withApiMiddleware(handler);