import express from "express";

import { getMe, login, logout, register, updateProfile } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfile);

export default router;

