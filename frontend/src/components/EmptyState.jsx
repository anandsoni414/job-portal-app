import { Inbox } from "lucide-react";

export default function EmptyState({ title, message }) {
  return (
    <div className="panel flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>}
    </div>
  );
}

