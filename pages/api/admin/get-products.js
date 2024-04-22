import connectToDB from "@/app/database";
import Product from "@/app/models/products";

export const dynamic = "force-dynamic";

export default async function handler(req, res, next) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser.role === "admin") {
      try {
        // Use Product.find() without a filter to retrieve all documents from the collection
        const products = await Product.find({});

        // If products array is returned, the operation was successful
        return res.status(200).json({
          success: true,
          message: "Products fetched successfully",
          data: products,
        });
      } catch (error) {
        // Log and return error response if Product.find fails
        console.error("Error fetching products:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    } else {
      // User is not admin
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    // Handle failed connection to DB
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database" + error.message,
    });
  }
}
