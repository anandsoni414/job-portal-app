import jwt from "jsonwebtoken";

export const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const sendToken = (res, user, statusCode = 200) => {
  const token = signToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;

  res.status(statusCode).json({
    token,
    user: safeUser,
  });
};

