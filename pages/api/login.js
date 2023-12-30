import connectToDB from "@/app/database";
import User from "@/app/models/user";
import { compare } from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default async function handler(req, res) {
  console.log("Running api/login");
  await connectToDB();

  const { email, password } = req.body;
  const { error } = schema.validate({ email, password });
  let correctEmail = email.toLowerCase();

  console.log("validating email");
  if (error) {
    return res.status(400).json({
      success: false,
      message: `Not correct input form for email and password ${error.details[0].message}`,
    });
  }
  console.log("schema Validated");

  try {
    const user = await User.findOne({ correctEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Account not found",
      });
    }
    console.log("Email found Validated");
    const checkPassword = await compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    console.log("Password Validated");

    const token = jwt.sign(
      {
        id: user._id,
        email: user?.correctEmail,
        role: user?.role,
      },
      "default_secret_key",
      { expiresIn: "1d" },
    );

    const finalData = {
      token,
      user: {
        email: user.correctEmail,
        name: user.name,
        _id: user._id,
        role: user.role,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      finalData,
    });
  } catch (e) {
    console.log("Error in api/route/login", e);

    return res.status(500).json({
      success: false,
      message: "api/route/login",
    });
  }
}
