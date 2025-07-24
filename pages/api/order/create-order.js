import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";
import User from "@/models/user";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

export const dynamic = "force-dynamic";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = req.body;
      const { user } = data;

      const saveNewOrder = await Order.create({
        user: data.user,
        orderItems: data.orderItems,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod || "Stripe",
        totalPrice: data.totalPrice,
        isPaid: data.isPaid || false,
        isProcessing: data.isProcessing || true,
        orderStatus: "pending",
        statusHistory: [{
          status: "pending",
          timestamp: new Date(),
          note: "Order created, awaiting payment"
        }]
      });

      if (saveNewOrder) {
        return res.status(200).json({
          success: true,
          message: "Order created successfully",
          data: saveNewOrder
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to create an order! Please try again",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "You are not authenticated",
      });
    }
  } catch (e) {
    console.error("Order creation error:", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again later",
    });
  }
}

export default withApiMiddleware(handler);
