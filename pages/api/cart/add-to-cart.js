import connectToDB from "@/database";
import User from "@/models/user";
import mongoose from "mongoose";
import AuthUser from "@/middleware/AuthUser";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

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
  } else if (user.id !== req.body.userID) {
    return res.status(403).json({
      success: false,
      message:
        "Forbidden, you are not allowed to perform this action from this account.",
    });
  }

  try {
    await connectToDB();

    const { productID, userID, quantity } = req.body;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const itemExistInCart = user.cart.find(
      (item) => item.productID.toString() === productID,
    );

    if (itemExistInCart) {
      return res.status(400).json({
        success: false,
        message:
          "Item already exists in cart. Cannot add the same product twice.",
      });
    }

    user.cart.push({
      productID: new mongoose.Types.ObjectId(productID),
      quantity,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: user.cart,
    });
  } catch (e) {
    console.error("Error in add-to-cart process:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}

export default withApiMiddleware(handler);
