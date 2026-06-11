import Company from "../models/Company.js";
import Job from "../models/Job.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      requirements = [],
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      company,
    } = req.body;

    if (!title || !description || !salary || !location || !company) {
      return res.status(400).json({
        message: "Title, description, salary, location, and company are required",
      });
    }

    const ownedCompany = await Company.findOne({ _id: company, userId: req.user._id });
    if (!ownedCompany) {
      return res.status(403).json({ message: "You can only post jobs for your own company" });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((item) => item.trim()).filter(Boolean),
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      company,
      created_by: req.user._id,
    });

    await job.populate("company", "companyName location logo website");
    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const {
      keyword = "",
      location = "",
      jobType = "",
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: "open" };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requirements: { $elemMatch: { $regex: keyword, $options: "i" } } },
      ];
    }

    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate("company", "companyName location logo website")
        .sort("-createdAt")
        .skip(skip)
        .limit(limitNumber),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "companyName description location logo website")
      .populate("created_by", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

export const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ created_by: req.user._id })
      .populate("company", "companyName location logo")
      .populate("applications", "status")
      .sort("-createdAt");

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Status must be open or closed" });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, created_by: req.user._id },
      { status },
      { new: true, runValidators: true },
    ).populate("company", "companyName location logo");

    if (!job) {
      return res.status(404).json({ message: "Job not found or not owned by you" });
    }

    res.json({ job });
  } catch (error) {
    next(error);
  }
};

