import { Banknote, Briefcase, Building2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { formatDate } from "../utils/format.js";

export default function JobCard({ job }) {
  return (
    <article className="panel p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-brand">
            <Briefcase className="h-3.5 w-3.5" />
            {job.jobType}
          </p>
          <h2 className="text-xl font-bold text-ink">{job.title}</h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {job.company?.companyName || "Company"}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Banknote className="h-4 w-4" />
              {job.salary}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <span className="text-xs font-medium text-slate-500">{formatDate(job.createdAt)}</span>
          <Link to={`/jobs/${job._id}`} className="btn-primary">
            View Job
          </Link>
        </div>
      </div>
    </article>
  );
}

