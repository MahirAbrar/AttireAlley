import connectToDB from "@/database";
import Order from "@/models/order";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
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

    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    await connectToDB();

    // Get order with all related data populated
    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate({
        path: "orderItems.productID",
        select: "name price imageURL category"
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order details retrieved successfully",
      data: order,
    });
  } catch (e) {
    console.error("Error in retrieving order details:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order details",
      error: e.message,
    });
  }
} 