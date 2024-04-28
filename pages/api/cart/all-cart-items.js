import connectToDB from "@/app/database";
import Cart from "@/app/models/cart";
import AuthUser from "@/middleware/AuthUser";

// !NEED TO FIX
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB();
    const isAuthUser = await AuthUser(req);

    if (!isAuthUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, you need to be logged in first.",
      });
    }

    const cartItems = await Cart.find({ userID: isAuthUser.id });

    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      data: cartItems,
    });
  } catch (e) {
    console.error("Error fetching cart items:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or fetch cart items",
    });
  }
}
