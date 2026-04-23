import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, Building2, ArrowRight, Shield, Clock, Zap, Ambulance, Heart, ChevronDown, BedDouble, Activity, CheckCircle2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EmergencyModal } from "@/components/EmergencyModal";
import { hospitals, ambulances } from "@/data/mockData";

export default function Landing() {
  const navigate = useNavigate();
  const [sosOpen, setSosOpen] = useState(false);
  const [activeAmbulance, setActiveAmbulance] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAmbulance((p) => (p + 1) % ambulances.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const availableAmbulances = ambulances.filter(a => a.status === "Available").length;
  const availableBeds = hospitals.reduce((a, h) => a + h.availableBeds, 0);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <EmergencyModal open={sosOpen} onOpenChange={setSosOpen} />

      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-10 py-3 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground tracking-tight">MedNav</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground gap-1.5" onClick={() => navigate("/admin/login")}>
            <Shield className="h-3.5 w-3.5" />
            Admin
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button size="sm" className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2 shadow-lg shadow-destructive/20" onClick={() => setSosOpen(true)}>
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Emergency</span> SOS
          </Button>
        </div>
      </nav>

      {/* ─── Live Ticker ─── */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 py-2 flex items-center gap-3 overflow-hidden">
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-success">LIVE</span>
          </span>
          <div className="overflow-hidden flex-1">
            <motion.p
              key={activeAmbulance}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-xs text-muted-foreground truncate"
            >
              🚑 {ambulances[activeAmbulance].vehicleNumber} — {ambulances[activeAmbulance].status} · {ambulances[activeAmbulance].driver} · {ambulances[activeAmbulance].hospitalName}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative px-5 md:px-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-destructive/5 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-16 md:py-24 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">24/7 Emergency Response Active</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.08]">
                Emergency Help,
                <br />
                <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                  When You Need
                </span>
                <br />
                It Most
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
                Request an ambulance, find nearby hospitals, and track help in real-time — all in one tap.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2 shadow-xl shadow-destructive/20 text-base px-8"
                  onClick={() => navigate("/request")}
                >
                  <Phone className="h-5 w-5" />
                  SOS Emergency
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full gap-2 text-base px-8"
                  onClick={() => navigate("/login")}
                >
                  Login / Sign Up
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Stats strip */}
              <div className="flex gap-6 pt-2">
                {[
                  { value: `${hospitals.length}+`, label: "Hospitals" },
                  { value: `${ambulances.length}+`, label: "Ambulances" },
                  { value: "100+", label: "Lives Saved" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold font-display text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Live Dashboard Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
            <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-2xl shadow-primary/5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground">Live Status</h3>
                <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" /></span>
                  Online
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Building2, label: "Hospitals", value: hospitals.length, color: "text-primary", bg: "bg-primary/10" },
                  { icon: Ambulance, label: "Ambulances", value: ambulances.length, color: "text-warning", bg: "bg-warning/10" },
                  { icon: Zap, label: "Available", value: availableAmbulances, color: "text-success", bg: "bg-success/10" },
                  { icon: BedDouble, label: "Beds Free", value: availableBeds, color: "text-primary", bg: "bg-primary/10" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-secondary/50 p-3.5 space-y-1">
                    <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Activity</p>
                {ambulances.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-card border border-border">
                        <Ambulance className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-medium text-foreground">{a.vehicleNumber}</p>
                        <p className="text-[10px] text-muted-foreground">{a.driver}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      a.status === "Available" ? "bg-success/10 text-success" :
                      a.status === "On Trip" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 md:-left-8 rounded-xl border border-border bg-card p-3 shadow-lg flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Avg. Response</p>
                <p className="text-xs text-muted-foreground">&lt;3 min dispatch time</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="flex justify-center pb-4">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
        </motion.div>
      </div>

      {/* ─── How It Works ─── */}
      <section className="px-5 md:px-10 py-16 md:py-24 bg-card/50 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">Three simple steps to get emergency help fast</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { step: "01", icon: Phone, title: "Request Ambulance", desc: "Share your location and get the nearest ambulance dispatched to you immediately.", link: "/request", color: "from-destructive/20 to-destructive/5" },
              { step: "02", icon: Building2, title: "Find Hospitals", desc: "Browse nearby hospitals with real-time bed availability and direct contact info.", link: "/hospitals", color: "from-primary/20 to-primary/5" },
              { step: "03", icon: MapPin, title: "Track In Real-Time", desc: "Live GPS tracking of your dispatched ambulance with accurate ETA updates.", link: "/track", color: "from-success/20 to-success/5" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(item.link)}
                className="relative rounded-2xl border border-border bg-card p-6 group hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <span className="text-4xl font-display font-bold text-border">{item.step}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mt-3 mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                  <span className="text-xs font-medium text-primary flex items-center gap-1">
                    Get Started <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="px-5 md:px-10 py-16 md:py-24 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground"><h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Why Choose MedNav?</h2></h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm">Trusted by thousands in emergency situations</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Average dispatch under 2 minutes" },
              { icon: CheckCircle2, title: "Verified Fleet", desc: "All ambulances GPS-tracked & certified" },
              { icon: Users, title: "Life-Saving", desc: "10,000+ successful emergency responses" },
              { icon: Shield, title: "24/7 Available", desc: "Round-the-clock emergency coverage" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-5 md:px-10 py-16 md:py-24 border-t border-border/50 bg-card/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Every Second Counts in an Emergency</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">Don't wait. Get immediate access to ambulances, hospitals, and real-time tracking — completely free.</p>
          <Button size="lg" className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2 px-8 shadow-xl shadow-destructive/20" onClick={() => navigate("/request")}>
            <Phone className="h-5 w-5" />
            Request Ambulance Now
          </Button>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 px-5 md:px-10 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <span className="font-display font-semibold text-foreground text-sm">MedNav</span>
            <span className="text-xs text-muted-foreground ml-1">· Emergency Management System</span>
          </div>
          <p className="text-xs text-muted-foreground"><p className="text-xs text-muted-foreground">© 2026 MedNav. Built for healthcare emergencies.</p></p>
        </div>
      </footer>
    </div>
  );
}
