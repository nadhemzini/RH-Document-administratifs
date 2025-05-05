import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie = (res, userId, kind) => {
  const token = jwt.sign({ userId, kind }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
