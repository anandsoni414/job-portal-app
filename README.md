# Full Stack Job Portal App

MERN job portal project generated from the shared ChatGPT discussion.

The chat discussed a placement-worthy job portal with React, Node.js, Express, MongoDB, JWT authentication, role-based recruiter/student flows, job search, applications, profile/resume data, recruiter dashboard, and dummy seed jobs.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Lucide icons
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT with HTTP-only cookie plus Bearer token support
- Roles: student and recruiter

## Features

- Student signup/login
- Recruiter signup/login
- Browse jobs
- Search by keyword, location, and job type
- View job details
- Apply to jobs with cover letter and resume URL
- View applied jobs
- Update student profile, skills, and resume URL
- Recruiter company management
- Recruiter job posting
- Recruiter job list
- Recruiter applicant list
- Accept/reject applicants
- Seed script for dummy jobs

## Folder Structure

```text
job-portal-app/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    seeds/
    server.js
  frontend/
    src/
      api/
      components/
      context/
      pages/
```

## Quick Start

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_portal
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Seed dummy data:

```bash
npm run seed
```

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo Accounts After Seeding

```text
Recruiter:
email: recruiter@example.com
password: Password123

Student:
email: student@example.com
password: Password123
```

## Main API Routes

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/profile
```

### Companies

```http
POST /api/companies
GET  /api/companies/my
GET  /api/companies/:id
PUT  /api/companies/:id
```

### Jobs

```http
POST /api/jobs
GET  /api/jobs
GET  /api/jobs/:id
GET  /api/jobs/recruiter/my
PATCH /api/jobs/:id/status
```

### Applications

```http
POST  /api/applications/jobs/:jobId/apply
GET   /api/applications/my
GET   /api/applications/jobs/:jobId/applicants
PATCH /api/applications/:applicationId/status
```

## Hinglish Build Notes

- Pehle JWT auth samjho: register, login, protected route.
- Fir MongoDB schemas banao: User, Company, Job, Application.
- Frontend me pehle pages banao: jobs list, login/register, job detail, applied jobs.
- Recruiter dashboard project ko placement-worthy banata hai.
- Tailwind important hai, lekin backend logic aur architecture interview me zyada value dete hain.
- Clerk Auth aur Sentry future upgrade ke liye add kar sakte ho; is starter me JWT manually implemented hai.

## Resume Line

Developed a role-based full-stack job portal using React, Node.js, Express, MongoDB, and JWT, featuring recruiter job posting, student applications, profile/resume management, protected routes, job search, and applicant status tracking.

