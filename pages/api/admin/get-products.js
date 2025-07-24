import connectToDB from "@/database";
import Product from "@/models/products";
import AuthUser from "@/middleware/AuthUser";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

export const dynamic = "force-dynamic";

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB();

    const user = await AuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, please log in.",
        isExpired: false,
      });
    } else if (user.isExpired) {
      return res.status(403).json({
        success: false,
        message: "Token expired, please log in again.",
        isExpired: true,
      });

      // not needed for next line
      // } else if (user.id != req.query.userID) {
      //   return res.status(403).json({
      //     success: false,
      //     message:
      //       "Forbidden, you are not allowed to perform this action from this account.",
      //   });
    }

    if (user.role === "admin") {
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
        message: "Unauthorized, please log in as an admin",
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

export default withApiMiddleware(handler);
