import { BriefcaseBusiness, LayoutDashboard, LogOut, User, UserRoundPlus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
    isActive ? "bg-teal-50 text-brand" : "text-slate-700 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="inline-flex items-center gap-2 text-lg font-bold text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand text-white">
            <BriefcaseBusiness className="h-5 w-5" />
          </span>
          JobPortal
        </NavLink>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Jobs
          </NavLink>

          {user?.role === "student" && (
            <NavLink to="/applications" className={navLinkClass}>
              Applications
            </NavLink>
          )}

          {user?.role === "recruiter" && (
            <NavLink to="/recruiter" className={navLinkClass}>
              <LayoutDashboard className="h-4 w-4" />
              Recruiter
            </NavLink>
          )}

          {user ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                <User className="h-4 w-4" />
                Profile
              </NavLink>
              <button className="btn-secondary" type="button" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary">
                <UserRoundPlus className="h-4 w-4" />
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

