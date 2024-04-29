import connectToDB from "@/app/database";
import Cart from "@/app/models/cart";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB();
    console.log("req.body is ", req.body);
    const { productID, userID, quantity } = req.body;

    console.log("Adding to cart:", { productID, userID, quantity });

    const itemExistInCart = await Cart.findOne({
      productID: mongoose.Types.ObjectId(productID),
      userID: mongoose.Types.ObjectId(userID),
    });

    if (itemExistInCart) {
      return res.status(400).json({
        success: false,
        message:
          "Item already exist in cart. Cannot add the same product twice.",
      });
    }

    const newCartItem = {
      productID: mongoose.Types.ObjectId(productID),
      userID: mongoose.Types.ObjectId(userID),
      quantity,
    };

    const addProductToCart = await Cart.create(newCartItem);

    if (addProductToCart) {
      return res.status(200).json({
        success: true,
        message: "Product added to cart successfully",
        data: addProductToCart,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed adding to cart. Please try again.",
      });
    }
  } catch (e) {
    console.error("Error adding to cart:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database",
    });
  }
}
