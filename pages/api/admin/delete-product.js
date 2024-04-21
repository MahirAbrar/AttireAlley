import connectToDB from "@/app/database";
import Product from "@/app/models/products";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Authentication and authorization logic here
    const user = "admin"; // This would typically come from your actual authentication logic

    if (user === "admin") {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // If the deletion was successful
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct, // Optionally return the deleted product's data
      });
    } else {
      // If the user is not recognized as an admin
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to connect to database or delete product" + error.message,
    });
  }
}
