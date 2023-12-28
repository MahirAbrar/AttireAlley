import connectToDB from "@/app/database";
import User from "@/app/models/user";
import { compare } from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export default async function POST(req) {
  console.log("Running api/login");
  await connectToDB();

  const { email, password } = await req.json();

  const { error } = schema.validate({ email, password });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Account not found",
      });
    }

    const checkPassword = await compare(password, user.password);
    if (!checkPassword) {
      return NextResponse.json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user?.email,
        role: user?.role,
      },
      "default_secret_key",
      { expiresIn: "1d" },
    );

    const finalData = {
      token,
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
        role: user.role,
      },
    };

    return NextResponse.json({
      success: true,
      message: "Login successfull!",
      finalData,
    });
  } catch (e) {
    console.log("Error in api/route/login", e);

    return NextResponse.json({
      success: false,
      message: "api/route/login",
    });
  }
}
