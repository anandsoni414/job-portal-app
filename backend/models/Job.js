import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    requirements: {
      type: [String],
      default: [],
    },
    salary: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "remote"],
      default: "full-time",
    },
    experienceLevel: {
      type: String,
      trim: true,
      default: "Fresher",
    },
    position: {
      type: Number,
      min: 1,
      default: 1,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true },
);

jobSchema.index({ title: "text", description: "text", requirements: "text" });

const Job = mongoose.model("Job", jobSchema);

export default Job;

