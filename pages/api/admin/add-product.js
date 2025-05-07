import connectToDB from "@/database";
import Product from "@/models/products";
import AuthUser from "@/middleware/AuthUser";
import Joi from "joi";

export const dynamic = "force-dynamic";

const addNewProductSchema = Joi.object({
  user: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  sizes: Joi.array().required(),
  deliveryInfo: Joi.string().required(),
  onSale: Joi.string().required(),
  imageURL: Joi.array().required(),
  priceDrop: Joi.number().required(),
});

export default async function handler(req, res, next) {
  // todo
  // const { error } = addNewProductSchema.validate(req.body);

  // if (error) {
  //   return NextResponse.status(400).json({
  //     success: false,
  //     message: error.details[0].message,
  //   });
  // }
  // Assuming connectToDB is an async function that returns a Promise when the connection is successful
  try {
    await connectToDB();

    const user = await AuthUser(req);
    console.log("Auth user:", user);
    console.log("Query userID:", req.query.userID);
    console.log("Types - user.id:", typeof user.id, "req.query.userID:", typeof req.query.userID);

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
      console.log("ID mismatch - user.id:", user.id, "req.query.userID:", req.query.userID);
      return res.status(403).json({
        success: false,
        message: "Forbidden, you are not allowed to perform this action from this account.",
      });
    }

    if (user.role === "admin") {
      console.log("Admin user. Add product");

      const data = req.body;

      try {
        // Since Product.create returns a Promise, you should await it to get the resolved value
        const newDataCreated = await Product.create(data);

        // If newDataCreated is truthy, the operation was successful
        return res.status(200).json({
          success: true,
          message: "New product added",
          data: newDataCreated,
        });
      } catch (error) {
        // Log and return error response if Product.create fails
        console.error("Error creating new product:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    } else {
      // User is not admin
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    // Handle failed connection to DB
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database" + error.message,
    });
  }
}
