import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import User from "@/models/user";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

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

    const { userId } = req.body;

    // Verify the user is clearing their own cart
    if (user._id !== userId && user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    await connectToDB();

    // Clear the user's cart
    const userDoc = await User.findById(user._id);
    if (userDoc) {
      userDoc.cart = [];
      await userDoc.save();

      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
}

export default withApiMiddleware(handler);