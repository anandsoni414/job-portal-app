# Job Portal Frontend

A modern Job Portal frontend built with React, Vite, and Tailwind CSS. This application allows students to search and apply for jobs, while recruiters can manage job postings and track applications through a dedicated dashboard.

## Features

### Student Features
- Browse and search available jobs
- View detailed job descriptions
- Apply for jobs
- User authentication (Login/Register)
- Manage profile and resume URL
- Track application history

### Recruiter Features
- Recruiter authentication
- Recruiter dashboard
- Create and manage job postings
- View and manage applicants

## Tech Stack

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- JWT Authentication

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the frontend directory and add:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

The application will run at:

```text
http://localhost:5173
```

## Project Structure

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── assets/
├── public/
├── .env.example
├── package.json
└── vite.config.js
```

## Available Routes

| Route | Description |
|---------|------------|
| `/` | Browse and search jobs |
| `/jobs/:id` | View job details and apply |
| `/login` | User login |
| `/register` | Student/Recruiter registration |
| `/profile` | Manage profile and resume |
| `/applications` | View application history |
| `/recruiter` | Recruiter dashboard |

## Backend Repository

The frontend communicates with the Job Portal backend API running on:

```text
http://localhost:5000/api
```

## Future Improvements

- Email notifications
- Resume upload support
- Job bookmarking
- Advanced filtering and sorting
- Real-time application status updates

## License

This project is built for learning and portfolio purposes.