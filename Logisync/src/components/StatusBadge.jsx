const statusStyles = {
  Available: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  "In Transit": "bg-blue-500/10 text-blue-700 border-blue-200",
  "On Trip": "bg-blue-500/10 text-blue-700 border-blue-200",
  Maintenance: "bg-amber-500/10 text-amber-700 border-amber-200",
  "Out of Service": "bg-red-500/10 text-red-700 border-red-200",
  "Off Duty": "bg-slate-500/10 text-slate-600 border-slate-200",
  "On Leave": "bg-purple-500/10 text-purple-700 border-purple-200",
  Pending: "bg-slate-500/10 text-slate-600 border-slate-200",
  Dispatched: "bg-amber-500/10 text-amber-700 border-amber-200",
  Delivered: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-500/10 text-red-700 border-red-200",
  Low: "bg-slate-500/10 text-slate-600 border-slate-200",
  Medium: "bg-blue-500/10 text-blue-700 border-blue-200",
  High: "bg-amber-500/10 text-amber-700 border-amber-200",
  Urgent: "bg-red-500/10 text-red-700 border-red-200",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyles[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}