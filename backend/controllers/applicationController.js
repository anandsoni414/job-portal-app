import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter = "", resumeUrl = "" } = req.body;

    const job = await Job.findById(jobId);
    if (!job || job.status !== "open") {
      return res.status(404).json({ message: "Open job not found" });
    }

    const finalResumeUrl = resumeUrl || req.user.resumeUrl;
    if (!finalResumeUrl) {
      return res.status(400).json({ message: "Please add a resume URL before applying" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl: finalResumeUrl,
      coverLetter,
    });

    job.applications.push(application._id);
    await job.save();

    await application.populate([
      { path: "job", select: "title location salary jobType company", populate: { path: "company", select: "companyName" } },
      { path: "applicant", select: "name email phone skills resumeUrl" },
    ]);

    res.status(201).json({ application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already applied to this job" });
    }
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title location salary jobType company status",
        populate: { path: "company", select: "companyName logo" },
      })
      .sort("-createdAt");

    res.json({ applications });
  } catch (error) {
    next(error);
  }
};

export const getApplicantsForJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, created_by: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found or not owned by you" });
    }

    const applications = await Application.find({ job: job._id })
      .populate("applicant", "name email phone skills resumeUrl")
      .populate("job", "title")
      .sort("-createdAt");

    res.json({ applications });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const application = await Application.findById(req.params.applicationId).populate("job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (String(application.job.created_by) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can update only your own job applications" });
    }

    application.status = status;
    await application.save();

    await application.populate("applicant", "name email phone skills resumeUrl");

    res.json({ application });
  } catch (error) {
    next(error);
  }
};

