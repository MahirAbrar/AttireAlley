import connectToDB from "@/app/database";
import User from "@/app/models/user";
import Address from "@/app/models/address";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // post method taking body data
  try {
    await connectToDB();
    console.log("Database connected successfully");
    console.log("req.body is ", req.body);

    const {
      userID,
      fullName,
      address,
      city,
      country,
      postalCode,
      additionalDetails,
    } = req.body;
    console.log("Adding new address:", {
      userID,
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

    console.log("New address added and associated with user:", newAddress);

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
