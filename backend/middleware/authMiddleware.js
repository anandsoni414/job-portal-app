import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to access this resource" });
    }

    next();
  };
};

