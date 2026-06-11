import express from "express";

import {
  applyToJob,
  getApplicantsForJob,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/jobs/:jobId/apply", authenticate, authorizeRoles("student"), applyToJob);
router.get("/my", authenticate, authorizeRoles("student"), getMyApplications);
router.get("/jobs/:jobId/applicants", authenticate, authorizeRoles("recruiter"), getApplicantsForJob);
router.patch("/:applicationId/status", authenticate, authorizeRoles("recruiter"), updateApplicationStatus);

export default router;

