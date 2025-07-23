import AuthUser from "@/middleware/AuthUser";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const user = await AuthUser(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    
    if (user.isExpired) {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        isExpired: true,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}