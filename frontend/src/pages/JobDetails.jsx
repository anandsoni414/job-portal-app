import { Banknote, Building2, CheckCircle2, MapPin, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/format.js";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || "");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchJob() {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        if (active) setJob(data.job);
      } catch (err) {
        if (active) setError(err.response?.data?.message || "Unable to load job");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchJob();
    return () => {
      active = false;
    };
  }, [id]);

  const handleApply = async (event) => {
    event.preventDefault();
    setApplying(true);
    setError("");
    setMessage("");

    try {
      await api.post(`/applications/jobs/${id}/apply`, { coverLetter, resumeUrl });
      setMessage("Application submitted");
      setCoverLetter("");
    } catch (err) {
      setError(err.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="panel h-96 animate-pulse bg-white" />;

  if (!job) {
    return (
      <div className="panel p-6">
        <p className="text-sm text-rose-700">{error || "Job not found"}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="badge bg-teal-50 text-brand">{job.jobType}</p>
            <h1 className="mt-3 text-3xl font-bold text-ink">{job.title}</h1>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.company?.companyName}
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
          </div>
          <span className="text-sm text-slate-500">{formatDate(job.createdAt)}</span>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-ink">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">{job.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink">Requirements</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.requirements?.length ? (
                job.requirements.map((skill) => (
                  <span className="badge bg-slate-100 text-slate-700" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No specific requirements listed.</span>
              )}
            </div>
          </div>

          <div className="grid gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Experience</p>
              <p className="mt-1 font-semibold text-ink">{job.experienceLevel}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Openings</p>
              <p className="mt-1 font-semibold text-ink">{job.position}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
              <p className="mt-1 font-semibold capitalize text-ink">{job.status}</p>
            </div>
          </div>
        </div>
      </section>

      <aside className="panel h-fit p-6">
        <h2 className="text-xl font-bold text-ink">Apply</h2>

        {!user ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm leading-6 text-slate-600">Login as a student to apply for this job.</p>
            <Link className="btn-primary w-full" to="/login">
              Login
            </Link>
          </div>
        ) : user.role !== "student" ? (
          <p className="mt-4 text-sm leading-6 text-slate-600">Recruiter accounts cannot apply to jobs.</p>
        ) : (
          <form className="mt-4 space-y-4" onSubmit={handleApply}>
            {message && (
              <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <CheckCircle2 className="mr-1 inline h-4 w-4" />
                {message}
              </div>
            )}
            {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

            <label>
              <span className="label">Resume URL</span>
              <input className="input" value={resumeUrl} onChange={(event) => setResumeUrl(event.target.value)} required />
            </label>

            <label>
              <span className="label">Cover Letter</span>
              <textarea
                className="input min-h-32"
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                placeholder="Short note for recruiter"
              />
            </label>

            <button className="btn-primary w-full" disabled={applying} type="submit">
              <Send className="h-4 w-4" />
              {applying ? "Applying..." : "Apply Now"}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}

