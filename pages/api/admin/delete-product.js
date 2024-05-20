import connectToDB from "@/app/database";
import Product from "@/app/models/products";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB();

    // id is productID
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await AuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, please log in",
      });
    } else if (user.isExpired) {
      return res.status(403).json({
        success: false,
        message: "Token expired, please log in again.",
      });
    }

    // Authentication and authorization logic here
    if (user.role === "admin") {
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
        message:
          "Unauthorized, only admins are allowed to perform this action.",
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
