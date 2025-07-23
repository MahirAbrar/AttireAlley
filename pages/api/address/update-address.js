import connectToDB from "@/database";
import User from "@/models/user";
import Address from "@/models/address";
import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
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
  } else if (user.id !== req.query.userID) {
    return res.status(403).json({
      success: false,
      message:
        "Forbidden, you are not allowed to perform this action from this account.",
    });
  }

  try {
    await connectToDB();

    const {
      userID,
      addressID,
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

    const addressToUpdate = await Address.findById(addressID);
    if (!addressToUpdate) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    addressToUpdate.fullName = fullName;
    addressToUpdate.address = address;
    addressToUpdate.city = city;
    addressToUpdate.country = country;
    addressToUpdate.postalCode = postalCode;
    addressToUpdate.additionalDetails = additionalDetails;

    await addressToUpdate.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: addressToUpdate,
    });
  } catch (e) {
    console.error("Error in update-address process:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database or other internal error",
      error: e.message,
    });
  }
}
