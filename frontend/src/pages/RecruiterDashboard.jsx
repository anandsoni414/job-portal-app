import { Briefcase, Building2, Check, ListChecks, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { api } from "../api/client.js";
import EmptyState from "../components/EmptyState.jsx";
import { formatDate, statusClass } from "../utils/format.js";

const companyInitial = {
  companyName: "",
  location: "",
  website: "",
  description: "",
};

const jobInitial = {
  title: "",
  company: "",
  location: "",
  salary: "",
  jobType: "internship",
  experienceLevel: "Fresher",
  position: 1,
  requirements: "",
  description: "",
};

export default function RecruiterDashboard() {
  const [tab, setTab] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [companyForm, setCompanyForm] = useState(companyInitial);
  const [jobForm, setJobForm] = useState(jobInitial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedJob = useMemo(() => jobs.find((job) => job._id === selectedJobId), [jobs, selectedJobId]);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [companyResponse, jobResponse] = await Promise.all([
        api.get("/companies/my"),
        api.get("/jobs/recruiter/my"),
      ]);
      setCompanies(companyResponse.data.companies);
      setJobs(jobResponse.data.jobs);

      const firstCompany = companyResponse.data.companies[0]?._id || "";
      setJobForm((current) => ({ ...current, company: current.company || firstCompany }));
      setSelectedJobId((current) => current || jobResponse.data.jobs[0]?._id || "");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load recruiter dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function loadApplicants(jobId) {
    if (!jobId) {
      setApplications([]);
      return;
    }

    setError("");
    try {
      const { data } = await api.get(`/applications/jobs/${jobId}/applicants`);
      setApplications(data.applications);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load applicants");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (tab === "applicants") loadApplicants(selectedJobId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, selectedJobId]);

  const updateCompanyForm = (event) => {
    setCompanyForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const updateJobForm = (event) => {
    setJobForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitCompany = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/companies", companyForm);
      setCompanies((current) => [data.company, ...current]);
      setJobForm((current) => ({ ...current, company: data.company._id }));
      setCompanyForm(companyInitial);
      setMessage("Company created");
    } catch (err) {
      setError(err.response?.data?.message || "Company creation failed");
    }
  };

  const submitJob = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...jobForm,
        position: Number(jobForm.position),
        requirements: jobForm.requirements
          .split(",")
          .map((requirement) => requirement.trim())
          .filter(Boolean),
      };
      const { data } = await api.post("/jobs", payload);
      setJobs((current) => [data.job, ...current]);
      setSelectedJobId(data.job._id);
      setJobForm({ ...jobInitial, company: payload.company });
      setMessage("Job posted");
    } catch (err) {
      setError(err.response?.data?.message || "Job creation failed");
    }
  };

  const changeJobStatus = async (jobId, status) => {
    setError("");
    try {
      const { data } = await api.patch(`/jobs/${jobId}/status`, { status });
      setJobs((current) => current.map((job) => (job._id === jobId ? data.job : job)));
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    }
  };

  const changeApplicationStatus = async (applicationId, status) => {
    setError("");
    try {
      const { data } = await api.patch(`/applications/${applicationId}/status`, { status });
      setApplications((current) =>
        current.map((application) => (application._id === applicationId ? data.application : application)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Application update failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Recruiter Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Manage companies, jobs, and applicants.</p>
        </div>
        <div className="inline-flex rounded-md border border-slate-200 bg-white p-1">
          {[
            ["companies", Building2, "Companies"],
            ["jobs", Briefcase, "Jobs"],
            ["applicants", ListChecks, "Applicants"],
          ].map(([key, Icon, label]) => (
            <button
              className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold ${
                tab === key ? "bg-brand text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
              key={key}
              type="button"
              onClick={() => setTab(key)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {message && <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="panel h-96 animate-pulse bg-white" />
      ) : tab === "companies" ? (
        <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <form className="panel h-fit p-5" onSubmit={submitCompany}>
            <h2 className="text-lg font-bold text-ink">Add Company</h2>
            <div className="mt-4 space-y-4">
              <label>
                <span className="label">Company Name</span>
                <input className="input" name="companyName" value={companyForm.companyName} onChange={updateCompanyForm} required />
              </label>
              <label>
                <span className="label">Location</span>
                <input className="input" name="location" value={companyForm.location} onChange={updateCompanyForm} required />
              </label>
              <label>
                <span className="label">Website</span>
                <input className="input" name="website" value={companyForm.website} onChange={updateCompanyForm} />
              </label>
              <label>
                <span className="label">Description</span>
                <textarea className="input min-h-28" name="description" value={companyForm.description} onChange={updateCompanyForm} />
              </label>
              <button className="btn-primary w-full" type="submit">
                <Plus className="h-4 w-4" />
                Add Company
              </button>
            </div>
          </form>

          {companies.length ? (
            <div className="grid gap-4">
              {companies.map((company) => (
                <article className="panel p-5" key={company._id}>
                  <h3 className="text-lg font-bold text-ink">{company.companyName}</h3>
                  <p className="mt-1 text-sm text-slate-600">{company.location}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{company.description || "No description"}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No companies" message="Create a company before posting jobs." />
          )}
        </div>
      ) : tab === "jobs" ? (
        <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <form className="panel h-fit p-5" onSubmit={submitJob}>
            <h2 className="text-lg font-bold text-ink">Post Job</h2>
            <div className="mt-4 space-y-4">
              <label>
                <span className="label">Company</span>
                <select className="input" name="company" value={jobForm.company} onChange={updateJobForm} required>
                  <option value="">Select company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="label">Title</span>
                <input className="input" name="title" value={jobForm.title} onChange={updateJobForm} required />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="label">Location</span>
                  <input className="input" name="location" value={jobForm.location} onChange={updateJobForm} required />
                </label>
                <label>
                  <span className="label">Salary</span>
                  <input className="input" name="salary" value={jobForm.salary} onChange={updateJobForm} required />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  <span className="label">Job Type</span>
                  <select className="input" name="jobType" value={jobForm.jobType} onChange={updateJobForm}>
                    <option value="internship">Internship</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                </label>
                <label>
                  <span className="label">Openings</span>
                  <input className="input" min="1" name="position" type="number" value={jobForm.position} onChange={updateJobForm} />
                </label>
              </div>
              <label>
                <span className="label">Experience</span>
                <input className="input" name="experienceLevel" value={jobForm.experienceLevel} onChange={updateJobForm} />
              </label>
              <label>
                <span className="label">Requirements</span>
                <input className="input" name="requirements" placeholder="React, Node.js, MongoDB" value={jobForm.requirements} onChange={updateJobForm} />
              </label>
              <label>
                <span className="label">Description</span>
                <textarea className="input min-h-32" name="description" value={jobForm.description} onChange={updateJobForm} required />
              </label>
              <button className="btn-primary w-full" disabled={!companies.length} type="submit">
                <Plus className="h-4 w-4" />
                Post Job
              </button>
            </div>
          </form>

          {jobs.length ? (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <article className="panel p-5" key={job._id}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {job.company?.companyName} - {job.location} - {job.salary}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">Posted {formatDate(job.createdAt)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`badge ${statusClass(job.status)}`}>{job.status}</span>
                      <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => changeJobStatus(job._id, job.status === "open" ? "closed" : "open")}
                      >
                        {job.status === "open" ? "Close" : "Open"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No jobs posted" message="Post your first role after adding a company." />
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="panel p-4">
            <label>
              <span className="label">Select Job</span>
              <select className="input" value={selectedJobId} onChange={(event) => setSelectedJobId(event.target.value)}>
                <option value="">Select job</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedJob && <p className="text-sm font-medium text-slate-600">Applicants for {selectedJob.title}</p>}

          {applications.length ? (
            <div className="grid gap-4">
              {applications.map((application) => (
                <article className="panel p-5" key={application._id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{application.applicant?.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">{application.applicant?.email}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {application.applicant?.skills?.map((skill) => (
                          <span className="badge bg-slate-100 text-slate-700" key={skill}>
                            {skill}
                          </span>
                        ))}
                      </div>
                      {application.coverLetter && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{application.coverLetter}</p>
                      )}
                      {application.resumeUrl && (
                        <a
                          className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
                          href={application.resumeUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Resume
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`badge ${statusClass(application.status)}`}>{application.status}</span>
                      <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => changeApplicationStatus(application._id, "accepted")}
                      >
                        <Check className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        className="btn-danger"
                        type="button"
                        onClick={() => changeApplicationStatus(application._id, "rejected")}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No applicants" message="Applications will appear after students apply." />
          )}
        </div>
      )}
    </div>
  );
}

