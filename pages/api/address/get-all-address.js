import connectToDB from "@/app/database";
import User from "@/app/models/user";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectToDB();
    console.log("Database connected successfully");
    console.log("req.query is ", req.query);

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

    // ...

    console.log("Addresses found:", addresses);

    return res
      .status(200)
      .json({
        success: true,
        message: "Addresses retrieved successfully",
        data: addresses,
      });
  } catch (e) {
    console.error("Error in get-all-address process:", e);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to connect to database or other internal error",
        error: e.message,
      });
  }
}
