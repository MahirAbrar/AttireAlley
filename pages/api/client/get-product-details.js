import connectToDB from "@/app/database";
import Product from "@/app/models/products";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { productId } = req.query; // Extract productID from request parameters

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  try {
    await connectToDB();

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If the product is found, return it
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching the product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database",
    });
  }
}
