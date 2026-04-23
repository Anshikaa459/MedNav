import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Ambulance, AlertTriangle, BedDouble, Phone, MapPin, Activity, Clock, CheckCircle2, Siren } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { hospitals, ambulances, recentActivities } from "@/data/mockData";
import { EmergencyModal } from "@/components/EmergencyModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sosOpen, setSosOpen] = useState(false);

  const availableAmbulances = ambulances.filter((a) => a.status === "Available").length;
  const onTripAmbulances = ambulances.filter((a) => a.status === "On Trip").length;
  const availableBeds = hospitals.reduce((a, h) => a + h.availableBeds, 0);
  const emergencyActive = onTripAmbulances > 0;

  const stats = [
    { icon: Building2, label: "Nearby Hospitals", value: hospitals.length, sub: `${hospitals.filter(h => h.status === "Active").length} active`, color: "text-primary", bg: "bg-primary/10" },
    { icon: Ambulance, label: "Available Ambulances", value: availableAmbulances, sub: `${ambulances.length} total in fleet`, color: "text-success", bg: "bg-success/10" },
    { icon: BedDouble, label: "Beds Available", value: availableBeds, sub: "Across all hospitals", color: "text-primary", bg: "bg-primary/10" },
    { icon: AlertTriangle, label: "Emergency Status", value: emergencyActive ? "Active" : "None", sub: `${onTripAmbulances} trips in progress`, color: emergencyActive ? "text-destructive" : "text-success", bg: emergencyActive ? "bg-destructive/10" : "bg-success/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <EmergencyModal open={sosOpen} onOpenChange={setSosOpen} />

      <main className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-10 space-y-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {user?.name?.split(" ")[0] || "Friend"} 👋
          </h1>
          <p className="text-sm text-muted-foreground">Here's what's happening across the network right now.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
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

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <button
            onClick={() => navigate("/hospitals")}
            className="group text-left rounded-2xl border border-border bg-gradient-to-br from-primary/15 to-primary/5 p-5 hover:border-primary/40 transition-colors"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 mb-4">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-lg">Find Hospitals</h3>
            <p className="text-sm text-muted-foreground mt-1">Browse beds & emergency availability.</p>
          </button>

          <button
            onClick={() => navigate("/track")}
            className="group text-left rounded-2xl border border-border bg-gradient-to-br from-success/15 to-success/5 p-5 hover:border-success/40 transition-colors"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success text-success-foreground shadow-lg shadow-success/20 mb-4">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-foreground text-lg">Track Ambulance</h3>
            <p className="text-sm text-muted-foreground mt-1">Live GPS & ETA updates.</p>
          </button>
        </div>

        {/* Activity + Fleet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Recent Activity
              </h3>
              <span className="text-xs text-muted-foreground">Last 24 hours</span>
            </div>
            <div className="space-y-2">
              {recentActivities.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-card border border-border shrink-0">
                    {a.type === "dispatch" && <Ambulance className="h-3.5 w-3.5 text-warning" />}
                    {a.type === "hospital" && <Building2 className="h-3.5 w-3.5 text-primary" />}
                    {a.type === "return" && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                    {a.type === "maintenance" && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{a.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Fleet Snapshot</h3>
            <div className="space-y-3">
              {ambulances.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary shrink-0">
                      <Ambulance className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-medium text-foreground truncate">{a.vehicleNumber}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{a.driver}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    a.status === "Available" ? "bg-success/10 text-success" :
                    a.status === "On Trip" ? "bg-warning/10 text-warning" :
                    "bg-destructive/10 text-destructive"
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full rounded-full" onClick={() => navigate("/track")}>
              View all units
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
