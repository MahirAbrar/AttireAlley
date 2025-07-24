import Stripe from "stripe";
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

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    // Check recent checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 5,
    });

    const sessionDetails = await Promise.all(
      sessions.data.map(async (session) => ({
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total / 100,
        currency: session.currency,
        created: new Date(session.created * 1000).toISOString(),
        metadata: session.metadata,
        success_url: session.success_url,
      }))
    );

    // Check webhook configuration
    const webhookEndpoints = await stripe.webhookEndpoints.list({
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      data: {
        environment: {
          webhookSecretExists: !!process.env.STRIPE_WEBHOOK_SECRET,
          stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
          nodeEnv: process.env.NODE_ENV,
        },
        recentSessions: sessionDetails,
        webhookEndpoints: webhookEndpoints.data.map(endpoint => ({
          id: endpoint.id,
          url: endpoint.url,
          enabled_events: endpoint.enabled_events,
          status: endpoint.status,
          created: new Date(endpoint.created * 1000).toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Stripe debug error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Stripe debug info",
      error: error.message,
    });
  }
}

export default withApiMiddleware(handler);