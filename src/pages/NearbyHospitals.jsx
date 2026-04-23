import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Building2, MapPin, BedDouble, Clock, Star, Phone, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { hospitals } from "@/data/mockData";

const distances = ["1.2 km", "2.8 km", "3.5 km", "4.1 km", "5.6 km", "6.3 km", "7.8 km", "9.2 km"];
const ratings = [4.8, 4.5, 4.7, 4.2, 4.0, 3.9, 4.6, 4.3];
const specialties = ["Multi-Specialty", "Cardiac Care", "Trauma Center", "General", "General", "Orthopedics", "Neuro Center", "General"];

export default function NearbyHospitals() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = hospitals.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalBeds = hospitals.reduce((a, h) => a + h.availableBeds, 0);
  const er24x7 = hospitals.filter((h) => h.status === "Active").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">Nearby Hospitals</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} hospitals found near you</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "TOTAL", value: hospitals.length, color: "text-primary" },
              { label: "24/7 ER", value: er24x7, color: "text-primary" },
              { label: "BEDS", value: totalBeds, color: "text-success" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
                <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Hospital list */}
          <div className="space-y-3">
            {filtered.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 mt-0.5">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-foreground text-sm">{h.name}</h3>
                      <p className="text-xs text-muted-foreground">{specialties[i] || "General"}</p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {distances[i] || "10+ km"}
                        </span>
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                          h.availableBeds > 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        }`}>
                          <BedDouble className="h-3 w-3" />
                          {h.availableBeds > 0 ? `${h.availableBeds} beds` : "No beds"}
                        </span>
                        {h.status === "Active" && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            <Clock className="h-3 w-3" />
                            24/7
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-warning">
                          <Star className="h-3 w-3 fill-warning" />
                          {ratings[i] || 4.0}
                        </span>
                      </div>

                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5">
                        <MapPin className="h-3 w-3" />
                        {h.address}, {h.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" className="gap-1.5 rounded-full text-xs h-8 px-3">
                      <PhoneIcon className="h-3 w-3" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 rounded-full text-xs h-8 px-3">
                      <Map className="h-3 w-3" />
                      Map
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
