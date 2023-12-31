// src/app/auth/passport-config.js
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email: { $regex: new RegExp(`^${email}$`, "i") },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
