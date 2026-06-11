import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../api/client.js";
import EmptyState from "../components/EmptyState.jsx";
import JobCard from "../components/JobCard.jsx";

const initialFilters = {
  keyword: "",
  location: "",
  jobType: "",
};

export default function Home() {
  const [filters, setFilters] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchJobs(nextPage = page) {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/jobs", {
        params: {
          ...filters,
          page: nextPage,
          limit: 8,
        },
      });
      setJobs(data.jobs);
      setPagination(data.pagination);
      setPage(nextPage);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJobs(1);
  };

  const updateFilter = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-ink px-5 py-8 text-white sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">MERN Job Portal</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Find jobs and internships built for freshers</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
            Browse roles, apply with your profile, and manage applications in one place.
          </p>
        </div>
      </section>

      <form className="panel grid gap-3 p-4 md:grid-cols-[1fr_1fr_180px_auto]" onSubmit={handleSubmit}>
        <label>
          <span className="label">Keyword</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              className="input pl-10"
              name="keyword"
              placeholder="React, Node, Intern"
              value={filters.keyword}
              onChange={updateFilter}
            />
          </div>
        </label>
        <label>
          <span className="label">Location</span>
          <input
            className="input"
            name="location"
            placeholder="Bangalore, Remote"
            value={filters.location}
            onChange={updateFilter}
          />
        </label>
        <label>
          <span className="label">Job Type</span>
          <select className="input" name="jobType" value={filters.jobType} onChange={updateFilter}>
            <option value="">All</option>
            <option value="internship">Internship</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </label>
        <div className="flex items-end">
          <button className="btn-primary w-full" type="submit">
            <Filter className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="panel h-40 animate-pulse bg-white" key={index} />
          ))}
        </div>
      ) : jobs.length ? (
        <>
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard job={job} key={job._id} />
            ))}
          </div>

          {pagination?.pages > 1 && (
            <div className="flex items-center justify-between">
              <button
                className="btn-secondary"
                disabled={page <= 1}
                type="button"
                onClick={() => fetchJobs(page - 1)}
              >
                Previous
              </button>
              <span className="text-sm font-medium text-slate-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                className="btn-secondary"
                disabled={page >= pagination.pages}
                type="button"
                onClick={() => fetchJobs(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No jobs found" message="Try another keyword or location." />
      )}
    </div>
  );
}

