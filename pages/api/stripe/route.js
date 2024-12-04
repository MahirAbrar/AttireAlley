import Stripe from "stripe";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = "force-dynamic";

export default async function handler(req, res) {
  console.log("striping");
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

    // Get the base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://attirealley.vercel.app/");

    // Parse the request body
    const { createLineItems } = req.body;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: createLineItems, // Make sure this matches what you're sending
      mode: "payment",
      success_url: `${baseUrl}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?status=cancel`,
    });

    return res.status(200).json({
      success: true,
      id: session.id,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong! Please try again",
    });
  }
}
