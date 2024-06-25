import Stripe from "stripe";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = "force-dynamic";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  try {
    // Authorization check
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

    // Parse the request body
    const requestBody = await req.body;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: requestBody.lineItems, // Ensure you're passing the correct data structure
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?status=cancel`,
    });

    return res.status(200).json({
      success: true,
      id: session.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
