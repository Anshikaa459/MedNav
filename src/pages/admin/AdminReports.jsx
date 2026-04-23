import { BarChart3, TrendingUp, Activity, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { useAdmin } from "@/context/AdminContext";

const weekly = [
  { day: "Mon", requests: 12, completed: 10 },
  { day: "Tue", requests: 18, completed: 15 },
  { day: "Wed", requests: 9, completed: 9 },
  { day: "Thu", requests: 22, completed: 19 },
  { day: "Fri", requests: 28, completed: 24 },
  { day: "Sat", requests: 31, completed: 27 },
  { day: "Sun", requests: 16, completed: 14 },
];

const responseTimes = [
  { week: "W1", minutes: 11 },
  { week: "W2", minutes: 9 },
  { week: "W3", minutes: 10 },
  { week: "W4", minutes: 7 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--success))"];

export default function AdminReports() {
  const { requests, ambulances, hospitals, users } = useAdmin();

  const byType = ["Cardiac", "Trauma", "General", "Maternity", "Pediatric"].map((t) => ({
    name: t,
    value: requests.filter((r) => r.type === t).length,
  })).filter((x) => x.value > 0);

  const byStatus = ["Pending", "Assigned", "Completed", "Cancelled"].map((s) => ({
    name: s,
    value: requests.filter((r) => r.status === s).length,
  })).filter((x) => x.value > 0);

  const kpis = [
    { icon: Activity, label: "Total Requests", value: requests.length, sub: "All time" },
    { icon: TrendingUp, label: "Completion Rate", value: `${Math.round((requests.filter(r => r.status === "Completed").length / Math.max(requests.length, 1)) * 100)}%`, sub: "Across all" },
    { icon: Users, label: "Active Users", value: users.filter(u => u.status === "Active").length, sub: `of ${users.length}` },
    { icon: BarChart3, label: "Fleet Utilization", value: `${Math.round((ambulances.filter(a => a.status === "On Trip").length / Math.max(ambulances.length, 1)) * 100)}%`, sub: `${hospitals.length} hospitals` },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">Operational insights across the network.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-4 md:p-5 space-y-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <k.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl md:text-3xl font-bold font-display text-foreground">{k.value}</p>
            <div>
              <p className="text-sm font-medium text-foreground">{k.label}</p>
              <p className="text-xs text-muted-foreground">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Weekly Requests</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Avg Response Time (min)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={responseTimes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Requests by Type</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Requests by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
