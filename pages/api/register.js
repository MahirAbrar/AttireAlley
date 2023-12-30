// joi is a schema validator

import connectToDB from "@/app/database";
import User from "@/app/models/user";
import { hash } from "bcryptjs";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export default async function handler(req, res) {
  console.log("running api/register");
  await connectToDB();
  const { name, email, password, role } = req.body;
  //validate the schema
  console.log(name, email, password, role);
  let correctName = name
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  let correctEmail = email.toLowerCase();

  const { error } = schema.validate({ name, email, password, role });

  if (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const isUserAlreadyExists = await User.findOne({ email: correctEmail });
    console.log(isUserAlreadyExists);

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
    console.log("Error while new user registration. Please try again");

    return res.status(500).json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
