import connectToDB from "@/app/database";
import Cart from "@/app/models/cart";
import AuthUser from "@/middleware/AuthUser";
import Joi from "joi";

export const dynamic = "force-dynamic";

// const AddToCart = Joi.object({
//   productID: Joi.string().required(),
//   userID: Joi.string().required(),
// });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await connectToDB().then(() => {
      console.log("Database connected in add-to-cart.js");
    });

    const isAuthUser = await AuthUser(req);
    console.log(isAuthUser);
    // need to change
    if (isAuthUser) {
      const data = req.body;
      const { productID, userID } = req.body;

      // const { error } = AddToCart.validate({ userID, productID });

      // if (error) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Validation error, data entered is not in a valid format.",
      //   });
      // }

      // console.log("Checking if item exits");
      // const itemExistInCart = await Cart.find({
      //   productID: productID,
      //   userID: userID,
      // });

      // if (itemExistInCart.length !== 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message:
      //       "Item already exist in cart. Cannot add the same product twice.",
      //   });
      // }

      console.log(data);
      const addProductTOCart = await Cart.create(data);

      if (addProductTOCart) {
        return res.status(200).json({
          success: true,
          message: "Product added to cart successfully",
          data: addProductTOCart,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed adding to cart. Please try again.",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, you need to be logged in first.",
      });
    }
  } catch (e) {
    console.error("Error adding to cart:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to connect to database",
    });
  }
}
