import jwt from "jsonwebtoken";

const AuthUser = async (req) => {
  // First try to get token from cookie
  let token = null;
  const cookieHeader = req.headers.cookie;
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
    }
  }
  
  // Fallback to Authorization header for backward compatibility
  if (!token) {
    token = req.headers.authorization?.split(" ")[1];
  }
  
  if (!token) return false;

  try {
    const extractAuthUserInfo = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
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
