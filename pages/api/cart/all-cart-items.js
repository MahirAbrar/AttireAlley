import connectToDB from "@/app/database";
import User from "@/app/models/user";
import Products from "@/app/models/products";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const user = await AuthUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, please log in.",
    });
  } else if (user.isExpired) {
    return res.status(403).json({
      success: false,
      message: "Token expired, please log in again.",
    });
  } else if (user.id != req.query.userID) {
    return res.status(403).json({
      success: false,
      message:
        "Forbidden, you are not allowed to perform this action from this account.",
    });
  }

  console.log(user);
  try {
    await connectToDB();

    const { userID } = req.query;
    console.log("Retrieving cart items for user:", userID);

    const dbUser = await User.findById(userID).populate({
      path: "cart.productID",
      model: Products,
    });
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartItems = dbUser.cart;

    return res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully",
      data: cartItems,
    });
  } catch (e) {
    console.error("Error in retrieving cart items:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}
