import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      ref: "users",
    },

    productID: {
      type: String,
      ref: "products",
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true },
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
