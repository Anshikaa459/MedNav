import { motion } from "framer-motion";
import { Building2, Ambulance, Users, Siren, TrendingUp, Activity, CheckCircle2, Clock } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminDashboard() {
  const { hospitals, ambulances, users, requests } = useAdmin();

  const available = ambulances.filter((a) => a.status === "Available").length;
  const onTrip = ambulances.filter((a) => a.status === "On Trip").length;
  const pending = requests.filter((r) => r.status === "Pending").length;
  const completed = requests.filter((r) => r.status === "Completed").length;

  const stats = [
    { icon: Building2, label: "Hospitals", value: hospitals.length, sub: `${hospitals.filter(h => h.status === "Active").length} active`, color: "text-primary", bg: "bg-primary/10" },
    { icon: Ambulance, label: "Ambulances", value: ambulances.length, sub: `${available} available · ${onTrip} on trip`, color: "text-success", bg: "bg-success/10" },
    { icon: Users, label: "Users", value: users.length, sub: `${users.filter(u => u.status === "Active").length} active`, color: "text-foreground", bg: "bg-secondary" },
    { icon: Siren, label: "Open Requests", value: pending, sub: `${completed} completed today`, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground">Live operational snapshot of MedNav.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-4 md:p-5 space-y-2"
          >
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-2xl md:text-3xl font-bold font-display text-foreground">{s.value}</p>
            <div>
              <p className="text-sm font-medium text-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Recent Requests
            </h3>
          </div>
          <div className="space-y-2">
            {requests.slice(0, 6).map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                <div className="h-8 w-8 rounded-md bg-card border border-border flex items-center justify-center shrink-0">
                  {r.status === "Completed" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Siren className="h-4 w-4 text-destructive" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{r.patient} — {r.type}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{r.createdAt} · {r.location}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                  r.status === "Pending" ? "bg-warning/10 text-warning" :
                  r.status === "Assigned" ? "bg-primary/10 text-primary" :
                  r.status === "Completed" ? "bg-success/10 text-success" :
                  "bg-destructive/10 text-destructive"
                }`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Fleet Status
          </h3>
          <div className="space-y-3">
            {[
              { label: "Available", count: available, color: "bg-success" },
              { label: "On Trip", count: onTrip, color: "bg-warning" },
              { label: "Maintenance", count: ambulances.filter((a) => a.status === "Maintenance").length, color: "bg-destructive" },
            ].map((s) => {
              const pct = ambulances.length ? (s.count / ambulances.length) * 100 : 0;
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{s.label}</span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
