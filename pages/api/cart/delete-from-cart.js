import connectToDB from "@/database";
import User from "@/models/user";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
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
      isExpired: false,
    });
  } else if (user.isExpired) {
    return res.status(403).json({
      success: false,
      message: "Token expired, please log in again.",
      isExpired: true,
    });
  } else if (user.id != req.query.userID) {
    return res.status(403).json({
      success: false,
      message:
        "Forbidden, you are not allowed to perform this action from this account.",
    });
  }

  try {
    await connectToDB();
    const { userID, productID } = req.query;
    console.log(
      "Deleting cart item for user:",
      userID,
      "productID:",
      productID,
    );

    const dbUser = await User.findById(userID);
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const itemIndex = dbUser.cart.findIndex(
      (item) => item.productID.toString() === productID,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    dbUser.cart.splice(itemIndex, 1);
    await dbUser.save();

    return res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
    });
  } catch (e) {
    console.error("Error in deleting cart item:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}
