import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await register(form);
      navigate(user.role === "recruiter" ? "/recruiter" : "/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form className="panel p-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-ink">Create account</h1>
        <p className="mt-1 text-sm text-slate-600">Choose a role before starting.</p>

        {error && <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

        <div className="mt-5 space-y-4">
          <label>
            <span className="label">Name</span>
            <input className="input" name="name" value={form.name} onChange={updateForm} required />
          </label>
          <label>
            <span className="label">Email</span>
            <input className="input" name="email" type="email" value={form.email} onChange={updateForm} required />
          </label>
          <label>
            <span className="label">Password</span>
            <input
              className="input"
              minLength={6}
              name="password"
              type="password"
              value={form.password}
              onChange={updateForm}
              required
            />
          </label>
          <label>
            <span className="label">Role</span>
            <select className="input" name="role" value={form.role} onChange={updateForm}>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>
        </div>

        <button className="btn-primary mt-6 w-full" disabled={loading} type="submit">
          <UserRoundPlus className="h-4 w-4" />
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link className="font-semibold text-brand hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

