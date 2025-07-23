// joi is a schema validator

import connectToDB from "@/database";
import User from "@/models/user";
import { hash } from "bcryptjs";
import Joi from "joi";
import { withRateLimit, authLimiter } from "@/middleware/RateLimitMiddleware";

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export const dynamic = "force-dynamic";

async function registerHandler(req, res) {
  await connectToDB();
  const { name, email, password, role } = req.body;
  //validate the schema
  let correctName = name
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  let correctEmail = email.toLowerCase();

  const { error } = schema.validate({ name, email, password, role });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  try {
    const isUserAlreadyExists = await User.findOne({ email: correctEmail });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User exits, please try a different email.",
      });
    } else {
      const hashPassword = await hash(password, 12);

      const newlyCreatedUser = await User.create({
        name: correctName,
        email: correctEmail,
        password: hashPassword,
        role,
      });

      if (newlyCreatedUser) {
        return res.status(201).json({
          success: true,
          message: "Account created successfully.",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong at the backend! Please try again later",
    });
  }
}

export default withRateLimit(authLimiter)(registerHandler);
