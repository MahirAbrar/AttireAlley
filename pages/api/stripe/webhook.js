import Stripe from "stripe";
import connectToDB from "@/database";
import Order from "@/models/order";
import User from "@/models/user";
import { buffer } from "micro";

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Webhook handler - no middleware needed as it uses webhook signature for auth
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  console.log("Webhook called, secret exists:", !!webhookSecret);
  
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set in environment variables!");
    return res.status(500).json({
      success: false,
      message: "Webhook secret not configured",
    });
  }

  let event;
  const sig = req.headers["stripe-signature"];

  try {
    // Get the raw body for signature verification
    const rawBody = await buffer(req);
    
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  // Handle the event
  try {
    await connectToDB();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        console.log("Checkout session completed:", session.id);
        console.log("Session metadata:", session.metadata);
        
        // Extract user ID and order ID from metadata
        const userId = session.metadata?.userId;
        const orderId = session.metadata?.orderId;
        
        if (!userId) {
          console.error("No user ID found in checkout session metadata");
          console.error("Full session object:", JSON.stringify(session, null, 2));
          break;
        }

        let order;
        
        // If orderId is provided, find by ID, otherwise find most recent unpaid order
        if (orderId) {
          order = await Order.findById(orderId);
        } else {
          order = await Order.findOne({
            user: userId,
            isPaid: false,
            isProcessing: true
          }).sort({ createdAt: -1 });
        }

        if (order) {
          // Update order status
          order.isPaid = true;
          order.paidAt = new Date();
          order.isProcessing = false;
          order.orderStatus = "paid";
          order.stripeSessionId = session.id;
          
          // Add to status history
          order.statusHistory.push({
            status: "paid",
            timestamp: new Date(),
            note: `Payment confirmed via Stripe. Session ID: ${session.id}`,
          });
          
          await order.save();

          console.log(`Order ${order._id} marked as paid`);

          // Clear user's cart after successful payment
          const user = await User.findById(userId);
          if (user) {
            user.cart = [];
            await user.save();
            console.log(`Cart cleared for user ${userId}`);
          }
        } else {
          console.error(`No unpaid order found for user ${userId}`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.error(`Payment failed for payment intent ${paymentIntent.id}`);
        // Could update order status to failed or notify user
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process webhook",
      error: error.message,
    });
  }
}