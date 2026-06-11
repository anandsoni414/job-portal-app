export const formatDate = (value) => {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const statusClass = (status) => {
  if (status === "accepted") return "bg-emerald-50 text-emerald-700";
  if (status === "rejected") return "bg-rose-50 text-rose-700";
  if (status === "closed") return "bg-slate-200 text-slate-700";
  return "bg-amber-50 text-amber-700";
};

