import connectToDB from "@/app/database";
import User from "@/app/models/user";
import Address from "@/app/models/address";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectToDB();
    console.log("Database connected successfully");
    console.log("req.body is ", req.body);

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
    console.log("Updating address:", {
      userID,
      addressID,
      fullName,
      address,
      city,
      country,
      postalCode,
      additionalDetails,
    });

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

    console.log("Address updated:", addressToUpdate);

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
