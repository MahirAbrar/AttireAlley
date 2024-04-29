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
    console.log("Database connected successfully");

    console.log("req.body is ", req.body);
    const { productID, userID, quantity } = req.body;

    console.log("Adding to cart:", { productID, userID, quantity });

    const itemExistInCart = await Cart.findOne({
      productID: new mongoose.Types.ObjectId(productID),
      userID: new mongoose.Types.ObjectId(userID),
    });

    if (itemExistInCart) {
      console.log("Item already exists in cart:", itemExistInCart);
      return res.status(400).json({
        success: false,
        message:
          "Item already exists in cart. Cannot add the same product twice.",
      });
    }

    const newCartItem = {
      productID: new mongoose.Types.ObjectId(productID),
      userID: new mongoose.Types.ObjectId(userID),
      quantity,
    };

    console.log("Creating new cart item:", newCartItem);
    const addProductToCart = await Cart.create(newCartItem);
    console.log("New cart item added:", addProductToCart);

    if (addProductToCart) {
      return res.status(200).json({
        success: true,
        message: "Product added to cart successfully",
        data: addProductToCart,
      });
    } else {
      console.log("Failed to add product to cart after creation attempt.");
      return res.status(500).json({
        success: false,
        message: "Failed adding to cart. Please try again.",
      });
    }
  } catch (e) {
    console.error("Error in add-to-cart process:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}
