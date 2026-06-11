import Company from "../models/Company.js";

export const createCompany = async (req, res, next) => {
  try {
    const { companyName, description, location, website, logo } = req.body;

    if (!companyName || !location) {
      return res.status(400).json({ message: "Company name and location are required" });
    }

    const company = await Company.create({
      companyName,
      description,
      location,
      website,
      logo,
      userId: req.user._id,
    });

    res.status(201).json({ company });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already created this company" });
    }
    next(error);
  }
};

export const getMyCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ userId: req.user._id }).sort("-createdAt");
    res.json({ companies });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate("userId", "name email");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ company });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, userId: req.user._id });

    if (!company) {
      return res.status(404).json({ message: "Company not found or not owned by you" });
    }

    const allowedFields = ["companyName", "description", "location", "website", "logo"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) company[field] = req.body[field];
    }

    await company.save();
    res.json({ company });
  } catch (error) {
    next(error);
  }
};

