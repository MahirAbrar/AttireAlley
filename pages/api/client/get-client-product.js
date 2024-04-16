import connectToDB from "@/app/database";
import Product from "@/app/models/products";

export default async function handler(req, res) {
  console.log("Fetching products by category from backend");
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { category } = req.query; // Extract category from request parameters

  // Check if the category is valid
  if (!["kids", "men", "women"].includes(category.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid category specified",
    });
  }

  try {
    await connectToDB();
    console.log("Connected to database");

    // Fetch products by category
    const products = await Product.find({
      category: capitalizeFirstLetter(category),
    });

    if (products.length === 0) {
      // No products found under this category
      return res.status(404).json({
        success: false,
        message: "No products found",
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
