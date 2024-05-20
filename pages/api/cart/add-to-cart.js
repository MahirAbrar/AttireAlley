import connectToDB from "@/app/database";
import User from "@/app/models/user";
import mongoose from "mongoose";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
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
    });
  } else if (user.isExpired) {
    return res.status(403).json({
      success: false,
      message: "Token expired, please log in again.",
    });
  } else if (user.id != req.body.userID) {
    return res.status(403).json({
      success: false,
      message:
        "Forbidden, you are not allowed to perform this action from this account.",
    });
  }

  console.log(user);

  try {
    await connectToDB();
    console.log("Database connected successfully");
    console.log("req.body is ", req.body);

    const { productID, userID, quantity } = req.body;
    console.log("Adding to cart:", { productID, userID, quantity });

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
      console.log("Item already exists in cart:", itemExistInCart);
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

    console.log("Product added to user's cart:", user.cart);

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
