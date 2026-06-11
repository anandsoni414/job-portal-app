import { Save } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    skills: user?.skills?.join(", ") || "",
    resumeUrl: user?.resumeUrl || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await updateProfile({
        ...form,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form className="panel p-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Profile</h1>
            <p className="mt-1 text-sm text-slate-600">Role: {user.role}</p>
          </div>
          <button className="btn-primary" disabled={loading} type="submit">
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {message && <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
        {error && <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="label">Name</span>
            <input className="input" name="name" value={form.name} onChange={updateForm} required />
          </label>
          <label>
            <span className="label">Phone</span>
            <input className="input" name="phone" value={form.phone} onChange={updateForm} />
          </label>
          <label className="sm:col-span-2">
            <span className="label">Skills</span>
            <input className="input" name="skills" placeholder="React, Node.js, MongoDB" value={form.skills} onChange={updateForm} />
          </label>
          <label className="sm:col-span-2">
            <span className="label">Resume URL</span>
            <input className="input" name="resumeUrl" placeholder="https://..." value={form.resumeUrl} onChange={updateForm} />
          </label>
          <label className="sm:col-span-2">
            <span className="label">Bio</span>
            <textarea className="input min-h-28" name="bio" value={form.bio} onChange={updateForm} />
          </label>
        </div>
      </form>
    </div>
  );
}

