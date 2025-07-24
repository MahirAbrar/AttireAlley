import Stripe from "stripe";
import connectToDB from "@/database";
import Order from "@/models/order";
import User from "@/models/user";
import AuthUser from "@/middleware/AuthUser";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

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

    const { sessionId, orderId } = req.body;

    if (!sessionId && !orderId) {
      return res.status(400).json({
        success: false,
        message: "Either sessionId or orderId is required",
      });
    }

    await connectToDB();

    // Find the order
    let order;
    if (orderId) {
      order = await Order.findById(orderId);
    } else if (sessionId) {
      order = await Order.findOne({ stripeSessionId: sessionId });
    }

    if (!order) {
      // If no order found by sessionId, try to find the most recent unpaid order
      order = await Order.findOne({
        user: user._id,
        isPaid: false,
        isProcessing: true
      }).sort({ createdAt: -1 });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify user owns this order (unless admin)
    if (user.role !== "admin" && order.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    // If sessionId provided, verify with Stripe
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === "paid" && !order.isPaid) {
          // Update order status
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
            note: `Payment verified manually. Session ID: ${sessionId}`,
          });

          await order.save();

          // Clear user's cart
          const userDoc = await User.findById(order.user);
          if (userDoc) {
            userDoc.cart = [];
            await userDoc.save();
          }

          return res.status(200).json({
            success: true,
            message: "Payment verified and order updated",
            data: {
              order,
              stripeStatus: session.payment_status,
            },
          });
        } else if (session.payment_status === "paid" && order.isPaid) {
          return res.status(200).json({
            success: true,
            message: "Payment already verified",
            data: {
              order,
              stripeStatus: session.payment_status,
            },
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "Payment not completed",
            data: {
              stripeStatus: session.payment_status,
              orderStatus: order.orderStatus,
            },
          });
        }
      } catch (stripeError) {
        console.error("Stripe verification error:", stripeError);
        return res.status(500).json({
          success: false,
          message: "Failed to verify with Stripe",
          error: stripeError.message,
        });
      }
    }

    // Return current order status
    return res.status(200).json({
      success: true,
      data: {
        order,
        isPaid: order.isPaid,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
}

export default withApiMiddleware(handler);