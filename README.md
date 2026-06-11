# Job Portal Application

A full-stack Job Portal Application built using the MERN stack. The platform allows students to search and apply for jobs, while recruiters can post job openings and manage applications through a dedicated dashboard.

## Features

### Student Features
- User Registration & Login
- Browse and Search Jobs
- View Job Details
- Apply for Jobs
- Manage Profile
- Add Resume URL
- Track Applied Jobs

### Recruiter Features
- Recruiter Registration & Login
- Create Job Listings
- Update and Delete Job Posts
- View Applicants
- Manage Posted Jobs

### Security Features
- JWT Authentication
- Protected Routes
- Role-Based Access Control
- Secure API Access

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

## Project Structure

```text
job-portal-app/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/anandsoni414/job-portal-app.git
cd job-portal-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

### 4. Open Application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

## Screenshots

Add screenshots of:
- Home Page
- Login Page
- Job Details Page
- Student Dashboard
- Recruiter Dashboard

## Future Improvements

- Resume Upload Feature
- Email Notifications
- Advanced Job Filters
- Bookmark Jobs
- Interview Scheduling
- Real-Time Notifications

## Author

**Anand Babu**

GitHub: https://github.com/anandsoni414

## License

This project is created for learning, portfolio, and educational purposes.