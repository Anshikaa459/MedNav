import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Navigation, Gauge, Phone, User, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ambulances, hospitals } from "@/data/mockData";

const timeline = [
  { label: "Request received", time: "10:32 AM", done: true },
  { label: "Ambulance A-102 dispatched", time: "10:33 AM", done: true },
  { label: "En route to your location", time: "10:34 AM", done: true },
  { label: "Expected arrival", time: "~10:40 AM", done: false },
];

export default function TrackAmbulance() {
  const navigate = useNavigate();
  const [eta, setEta] = useState(6);
  const [progress, setProgress] = useState(70);

  useEffect(() => {
    const interval = setInterval(() => {
      setEta((p) => Math.max(1, p - 1));
      setProgress((p) => Math.min(95, p + 4));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const driver = ambulances[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Track Ambulance</h1>
              <p className="text-xs text-muted-foreground">Live tracking • Ambulance A-102</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-3 py-1.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Live
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* ETA Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                  <p className="text-3xl font-bold font-display text-foreground">{eta}<span className="text-lg ml-1 text-muted-foreground font-normal">min</span></p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3" />
                  2.4 km
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Gauge className="h-3 w-3" />
                  45 km/h
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Dispatched</span>
                <span>Arriving</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: "50%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Map placeholder */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg shadow-primary/5">
            <div className="relative h-[240px] bg-gradient-to-br from-primary/5 via-background to-primary/5">
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                {[...Array(8)].map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 30 + 15} x2="100%" y2={i * 30 + 15} stroke="hsl(var(--border))" strokeWidth="1" />
                ))}
                {[...Array(12)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 50 + 25} y1="0" x2={i * 50 + 25} y2="100%" stroke="hsl(var(--border))" strokeWidth="1" />
                ))}
              </svg>

              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full">
                <path d="M 140 80 Q 200 100 260 120 Q 320 140 380 160" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeDasharray="8 4" opacity="0.6" />
              </svg>

              {/* Ambulance marker */}
              <motion.div
                className="absolute"
                style={{ left: "25%", top: "28%" }}
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded-full mb-1">A-102</span>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <span className="text-lg">🚑</span>
                  </div>
                </div>
              </motion.div>

              {/* User marker */}
              <div className="absolute" style={{ right: "25%", bottom: "25%" }}>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-destructive-foreground bg-destructive px-2 py-0.5 rounded-full mb-1">You</span>
                  <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center border-2 border-destructive">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                  </div>
                </div>
              </div>

              {/* Live badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-full px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                <span className="text-xs font-medium text-foreground">Live Tracking</span>
              </div>
            </div>
          </motion.div>

          {/* Driver card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{driver.driver}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {driver.hospitalName}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Driver
                  </span>
                </div>
              </div>
              <Button size="sm" className="gap-1.5 rounded-full">
                <Phone className="h-3.5 w-3.5" />
                Call
              </Button>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-primary/5">
            <h3 className="font-display font-semibold text-foreground mb-4">Status Timeline</h3>
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      item.done ? "bg-success/10" : "bg-secondary"
                    }`}>
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={`w-0.5 h-8 ${item.done ? "bg-success/30" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-medium ${item.done ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
