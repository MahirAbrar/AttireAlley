import jwt from "jsonwebtoken";

const AuthUser = async (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return false;

  try {
    const extractAuthUserInfo = jwt.verify(token, "default_secret_key");
    if (extractAuthUserInfo) return extractAuthUserInfo;
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      // Token has expired
      return { isExpired: true };
    }
    console.log(e);
    return false;
  }
};

export default AuthUser;
