import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client.js";
import EmptyState from "../components/EmptyState.jsx";
import { formatDate, statusClass } from "../utils/format.js";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchApplications() {
      try {
        const { data } = await api.get("/applications/my");
        if (active) setApplications(data.applications);
      } catch (err) {
        if (active) setError(err.response?.data?.message || "Unable to load applications");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchApplications();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Applied Jobs</h1>
        <p className="mt-1 text-sm text-slate-600">Track submitted applications.</p>
      </div>

      {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="panel h-72 animate-pulse bg-white" />
      ) : applications.length ? (
        <div className="grid gap-4">
          {applications.map((application) => (
            <article className="panel p-5" key={application._id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink">{application.job?.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {application.job?.company?.companyName} - {application.job?.location}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Applied on {formatDate(application.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`badge ${statusClass(application.status)}`}>{application.status}</span>
                  <Link className="btn-secondary" to={`/jobs/${application.job?._id}`}>
                    <ExternalLink className="h-4 w-4" />
                    Job
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No applications yet" message="Apply to jobs from the listings page." />
      )}
    </div>
  );
}

