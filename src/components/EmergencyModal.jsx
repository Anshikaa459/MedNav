import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Truck, CheckCircle, Loader2, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function EmergencyModal({ open, onOpenChange }) {
  const [step, setStep] = useState("confirm");

  useEffect(() => {
    if (!open) {
      setTimeout(() => setStep("confirm"), 300);
    }
  }, [open]);

  const handleConfirm = () => {
    setStep("locating");
    setTimeout(() => setStep("dispatching"), 2000);
    setTimeout(() => setStep("dispatched"), 4000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-destructive/30 gap-0">
        <AnimatePresence mode="wait">
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold font-display text-foreground">Confirm Emergency</h2>
              <p className="text-sm text-muted-foreground">This will dispatch the nearest available ambulance to your location. Only use in real emergencies.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleConfirm}>
                  <Phone className="h-4 w-4 mr-2" />Confirm SOS
                </Button>
              </div>
            </motion.div>
          )}

          {step === "locating" && (
            <motion.div key="locating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h2 className="text-xl font-bold font-display text-foreground">Locating You...</h2>
              <p className="text-sm text-muted-foreground">Acquiring GPS coordinates and finding nearest ambulance</p>
              <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>19.0760° N, 72.8777° E</span>
              </div>
            </motion.div>
          )}

          {step === "dispatching" && (
            <motion.div key="dispatching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
                <Truck className="h-8 w-8 text-warning animate-pulse" />
              </div>
              <h2 className="text-xl font-bold font-display text-foreground">Dispatching Ambulance</h2>
              <p className="text-sm text-muted-foreground">Ambulance MH-01-AB-1234 is being dispatched</p>
              <div className="bg-secondary rounded-lg p-3 text-xs text-left space-y-1.5">
                <p className="text-muted-foreground">Driver: <span className="text-foreground font-medium">Rajesh Kumar</span></p>
                <p className="text-muted-foreground">Type: <span className="text-foreground font-medium">Advanced Life Support</span></p>
                <p className="text-muted-foreground">Hospital: <span className="text-foreground font-medium">City General Hospital</span></p>
              </div>
            </motion.div>
          )}

          {step === "dispatched" && (
            <motion.div key="dispatched" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-bold font-display text-foreground">Ambulance Dispatched!</h2>
              <p className="text-sm text-muted-foreground">Help is on the way. ETA: 3 minutes</p>
              <div className="bg-secondary rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-mono font-medium text-foreground">MH-01-AB-1234</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="font-medium text-foreground">Rajesh Kumar</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-medium text-foreground">+91 98765 43210</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "60%" }}
                    transition={{ duration: 2 }}
                    className="h-full rounded-full bg-success"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Ambulance is en route</p>
              </div>
              <Button className="w-full" onClick={() => onOpenChange(false)}>Done</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
