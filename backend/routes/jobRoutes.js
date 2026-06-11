import express from "express";

import {
  createJob,
  getJobById,
  getJobs,
  getRecruiterJobs,
  updateJobStatus,
} from "../controllers/jobController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/recruiter/my", authenticate, authorizeRoles("recruiter"), getRecruiterJobs);
router.get("/:id", getJobById);
router.post("/", authenticate, authorizeRoles("recruiter"), createJob);
router.patch("/:id/status", authenticate, authorizeRoles("recruiter"), updateJobStatus);

export default router;

