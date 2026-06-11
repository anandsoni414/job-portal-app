import dotenv from "dotenv";
import mongoose from "mongoose";

import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

dotenv.config();

const jobs = [
  {
    title: "Frontend Developer Intern",
    description: "Build responsive React interfaces and reusable UI components for product teams.",
    requirements: ["React", "JavaScript", "Tailwind CSS", "REST APIs"],
    salary: "25K/month",
    location: "Bangalore",
    jobType: "internship",
    experienceLevel: "Fresher",
    position: 4,
  },
  {
    title: "MERN Stack Developer",
    description: "Work on Node.js APIs, MongoDB schemas, and React dashboards for business workflows.",
    requirements: ["Node.js", "Express", "MongoDB", "React"],
    salary: "8-12 LPA",
    location: "Hyderabad",
    jobType: "full-time",
    experienceLevel: "0-2 years",
    position: 2,
  },
  {
    title: "Backend Developer Intern",
    description: "Create REST APIs, authentication middleware, and database queries using Express and MongoDB.",
    requirements: ["Express", "Mongoose", "JWT", "Postman"],
    salary: "20K/month",
    location: "Remote",
    jobType: "remote",
    experienceLevel: "Fresher",
    position: 3,
  },
  {
    title: "Junior React Developer",
    description: "Convert Figma designs into clean React screens and integrate API-driven data.",
    requirements: ["React Router", "Axios", "Hooks", "CSS"],
    salary: "5-7 LPA",
    location: "Pune",
    jobType: "full-time",
    experienceLevel: "0-1 years",
    position: 2,
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([Application.deleteMany({}), User.deleteMany({}), Company.deleteMany({}), Job.deleteMany({})]);

  const recruiter = await User.create({
    name: "Demo Recruiter",
    email: "recruiter@example.com",
    password: "Password123",
    role: "recruiter",
    phone: "9999999999",
    bio: "Hiring MERN developers for product teams.",
  });

  await User.create({
    name: "Demo Student",
    email: "student@example.com",
    password: "Password123",
    role: "student",
    phone: "8888888888",
    bio: "Second-year student learning MERN and DSA.",
    skills: ["React", "JavaScript", "Node.js"],
    resumeUrl: "https://example.com/demo-resume.pdf",
  });

  const company = await Company.create({
    companyName: "TechNova Labs",
    description: "A demo software company for job portal testing.",
    location: "Bangalore",
    website: "https://example.com",
    userId: recruiter._id,
  });

  await Job.insertMany(
    jobs.map((job) => ({
      ...job,
      company: company._id,
      created_by: recruiter._id,
    })),
  );

  console.log("Seed data inserted successfully");
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
