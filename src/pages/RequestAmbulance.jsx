import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, MapPin, Navigation, FileText, Ambulance, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const emergencyTypes = [
  { value: "accident", label: "🚗 Accident" },
  { value: "cardiac", label: "❤️ Cardiac Emergency" },
  { value: "breathing", label: "🫁 Breathing Difficulty" },
  { value: "injury", label: "🩹 Severe Injury" },
  { value: "pregnancy", label: "🤰 Pregnancy" },
  { value: "other", label: "📋 Other" },
];

export default function RequestAmbulance() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [locating, setLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setLocating(false);
          toast.success("Location detected!");
        },
        () => {
          setLocation("19.0760, 72.8777");
          setLocating(false);
          toast.info("Using default location (demo)");
        }
      );
    } else {
      setLocation("19.0760, 72.8777");
      setLocating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Ambulance requested Redirecting to tracking...");
    setTimeout(() => navigate("/track"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">Request Ambulance</h1>
            <p className="text-xs text-muted-foreground">Fill in details for quick dispatch</p>
          </div>
        </div>
      </div>

      {/* Gradient background */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-destructive/5 blur-[80px]" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Progress bar */}
            <div className="h-1 rounded-full bg-destructive mb-6" />

            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 md:p-8 space-y-6 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                  <Ambulance className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-foreground text-lg">Emergency Request</h2>
                  <p className="text-xs text-muted-foreground">We'll dispatch the nearest available ambulance</p>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Full Name
                </Label>
                <Input placeholder="Enter your full name" required />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input type="tel" placeholder="+91 98765 43210" required />
              </div>

              {/* Emergency Type */}
              <div className="space-y-2">
                <Label className="text-sm">Emergency Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    {emergencyTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  Location
                </Label>
                <Input
                  placeholder="Your address or landmark"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                >
                  <Navigation className="h-4 w-4" />
                  {locating ? "Detecting..." : "Use Current Location"}
                </Button>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Additional Notes
                </Label>
                <Textarea placeholder="Any additional details that might help..." rows={3} />
              </div>

              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2 h-11 text-base">
                <Ambulance className="h-5 w-5" />
                Request Ambulance Now
              </Button>

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock className="h-3 w-3" />
                Your information is secure and only shared with emergency responders
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
