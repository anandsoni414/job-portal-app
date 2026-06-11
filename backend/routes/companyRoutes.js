import express from "express";

import {
  createCompany,
  getCompanyById,
  getMyCompanies,
  updateCompany,
} from "../controllers/companyController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("recruiter"), createCompany);
router.get("/my", authenticate, authorizeRoles("recruiter"), getMyCompanies);
router.get("/:id", getCompanyById);
router.put("/:id", authenticate, authorizeRoles("recruiter"), updateCompany);

export default router;

