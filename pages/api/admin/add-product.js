import connectToDB from "@/app/database";
import Product from "@/app/models/products";
import Joi from "joi";

export const dynamic = "force-dynamic";

const addNewProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  sizes: Joi.array().required(),
  deliveryInfo: Joi.string().required(),
  onSale: Joi.string().required(),
  priceDrop: Joi.number().required(),
  imageURL: Joi.string().required(),
});

export default function handler(req, res, next) {
  // todo
  const { error } = addNewProductSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Schema Validation Error",
    });
  }
  connectToDB()
    .then(() => {
      console.log("Connected to database");

      const user = "admin";

      if (user === "admin") {
        console.log("Admin user. Add product");

        const data = req.body;

        console.log(data);
        // This is a promise
        const newDataCreated = Product.create(data);
        if (newDataCreated) {
          return res.status(200).json({
            success: true,
            message: "New product added",
            data: newDataCreated,
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "User is not admin",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    });
}
