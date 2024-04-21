import connectToDB from "@/app/database";
import Product from "@/app/models/products";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB();

    // Extract product updates from request body
    const productUpdates = req.body;

    // Authentication and authorization logic here
    const user = "admin"; // This would typically come from your actual authentication logic

    if (user !== "admin") {
      // If the user is not recognized as an admin
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Attempt to update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productUpdates.id,
      productUpdates,
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If the update was successful
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to connect to database or update product" + error.message,
    });
  }
}
