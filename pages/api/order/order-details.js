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

  const user = await AuthUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, please log in.",
      isExpired: false,
    });
  } else if (user.isExpired) {
    return res.status(403).json({
      success: false,
      message: "Token expired, please log in again.",
      isExpired: true,
    });
  }

  try {
    await connectToDB();

    const { orderID } = req.query;

    if (!orderID) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }


    const orderDetails = await Order.findById(orderID).populate(
      "orderItems.productID",
    );

    if (!orderDetails) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify user has access to this order
    if (orderDetails.user.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order details retrieved successfully",
      data: orderDetails,
    });
  } catch (e) {
    console.error("Error in retrieving order details:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}
