import connectToDB from "@/app/database";
import passport from "passport";
import "@/app/auth/passport-config";

import User from "@/app/models/user";
import { compare } from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default function handler(req, res, next) {
  console.log("Running api/login");
  connectToDB()
    .then(() => {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(400).json({
            success: false,
            message: info.message || "Incorrect email or password",
          });
        }
        req.logIn(user, { session: false }, async (err) => {
          if (err) {
            return next(err);
          }
          // Generate JWT or any other post-login logic here
          const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            "default_secret_key",
            { expiresIn: "1d" },
          );
          return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
              email: user.email,
              name: user.name,
              _id: user._id,
              role: user.role,
            },
          });
        });
      })(req, res, next);
    })
    .catch((e) => {
      console.error("Database connection error", e);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    });
}
