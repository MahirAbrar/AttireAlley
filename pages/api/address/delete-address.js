import connectToDB from "@/app/database";
import User from "@/app/models/user";
import Address from "@/app/models/address";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
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
    console.log("Database connected successfully");
    console.log("req.query is ", req.query);

    const { userID, addressID } = req.query;
    console.log("Deleting address:", { userID, addressID });

    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const address = await Address.findById(addressID);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    await Address.findByIdAndDelete(addressID);

    user.address = user.address.filter((id) => id.toString() !== addressID);
    await user.save();

    console.log("Address deleted and removed from user");

    return res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (e) {
    console.error("Error in delete-address process:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}
