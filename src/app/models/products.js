import mongoose from "mongoose";

// Creaters collection and schema for user

const ProductSchema = new mongoose.Schema(
  {
    user: String,
    name: String,
    description: String,
    price: Number,
    category: String,
    sizes: Array,
    deliveryInfo: String,
    onSale: String,
    imageURL: Array,
    priceDrop: Number,
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Products || mongoose.model("Products", ProductSchema);

export default Product;
