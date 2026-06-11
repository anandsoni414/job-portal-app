import User from "../models/User.js";
import { sendToken } from "../utils/token.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "student" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Role must be student or recruiter" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role });
    sendToken(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendToken(res, user);
  } catch (error) {
    next(error);
  }
};

export const logout = (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "phone", "bio", "skills", "resumeUrl"];
    const update = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }

    if (typeof update.skills === "string") {
      update.skills = update.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

