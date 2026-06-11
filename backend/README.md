# Job Portal Backend

Express + MongoDB API for the Job Portal app.

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

## Seed

```bash
npm run seed
```

## Important Concepts

- JWT auth is sent as an HTTP-only cookie and also returned as `token`.
- Protected routes use `authenticate`.
- Role-based routes use `authorizeRoles("student")` or `authorizeRoles("recruiter")`.
- `Application` has a unique index on `job + applicant` to prevent duplicate applications.
- Recruiters can update only jobs and applications belonging to their own posted jobs.

