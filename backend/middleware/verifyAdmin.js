import { User } from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - User not found",
      });
    }

    // Verify if the user is an Admin using the discriminator key kind
    if (user.kind !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error(`Verify Admin Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
