import connectToDB from "@/database";
import Product from "@/models/products";
import CorsMiddleware from "@/middleware/CorsMiddleware";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

export const dynamic = "force-dynamic";

async function handler(req, res) {
  // Apply CORS middleware
  await CorsMiddleware(req, res, () => {});

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { category } = req.query; // Extract category from request parameters

  // Check if the category is valid
  const lowerCaseCategory = category.toLowerCase();
  if (!["kids", "men", "women", "all"].includes(lowerCaseCategory)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category specified",
    });
  }

  try {
    await connectToDB();

    let products;
    let query = {};

    if (lowerCaseCategory === "all") {
        // Fetch all products regardless of category
        query = {};
    } else {
        // Fetch products for the specific category OR 'Everyone'
        const capitalizedCategory = capitalizeFirstLetter(category);
        query = {
            $or: [{ category: capitalizedCategory }, { category: "Everyone" }],
        };
    }
    
    products = await Product.find(query);


    if (!products || products.length === 0) {
      // No products found
      return res.status(404).json({
        success: false,
        message: `No products found for category '${category}'`,
      });
    }

    // If products are found, return them
    return res.status(200).json({
      success: true,
      message: `Products fetched successfully for ${category}`,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database",
    });
  }
}

// Helper function to capitalize the first letter of the category
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default withApiMiddleware(handler);
