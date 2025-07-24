import connectToDB from "@/database";
import User from "@/models/user";
import Address from "@/models/address";
import AuthUser from "@/middleware/AuthUser";
import { withApiMiddleware } from "@/middleware/ApiMiddleware";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const user = await AuthUser(req);
  // console.log(user);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, please log in.",
      isExpired: false,
    });
  } else if (user?.isExpired) {
    return res.status(403).json({
      success: false,
      message: "Token expired, please log in again.",
      isExpired: true,
    });
  } else if (user.id !== req.body.userID) {
    return res.status(403).json({
      success: false,
      message:
        "Forbidden, you are not allowed to perform this action from this account.",
    });
  }

  // post method taking body data
  try {
    await connectToDB();

    const {
      userID,
      fullName,
      address,
      city,
      country,
      postalCode,
      additionalDetails,
    } = req.body;

    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // add address to model schema and ID to userID.address
    const newAddress = new Address({
      userID,
      fullName,
      address,
      city,
      country,
      postalCode,
      additionalDetails,
    });
    await newAddress.save();

    user.address.push(newAddress._id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (e) {
    console.error("Error in add-new-address process:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}

export default withApiMiddleware(handler);
