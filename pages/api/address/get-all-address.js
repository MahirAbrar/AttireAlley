import connectToDB from "@/app/database";
import User from "@/app/models/user";
import Address from "@/app/models/address";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
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
  }

  try {
    await connectToDB();
    console.log("Database connected successfully");
    const { userID } = req.query;
    console.log("Getting all addresses for user:", userID);

    // ...

    const user = await User.findById(userID).populate("address");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const addresses = user.address || [];
    return res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully",
      data: addresses,
    });
  } catch (e) {
    console.error("Error in get-all-address process:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}
