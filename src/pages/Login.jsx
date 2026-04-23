import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Phone, ChevronRight, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";

/* ─── helpers ────────────────────────────────────────────────── */
const normalizePhone = (raw) => raw.replace(/[^\d+]/g, "");

// Simulate sending OTP (in production, call your SMS API here)
function sendOTP(phone) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.info(`[DEV] OTP for ${phone}: ${otp}`);
  return otp;
}

/* ─── OTP input ─────────────────────────────────────────────── */
function OTPInput({ value, onChange, disabled }) {
  const inputs = useRef([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      if (next[idx]) {
        next[idx] = "";
        onChange(next.join("").trimEnd());
      } else if (idx > 0) {
        inputs.current[idx - 1]?.focus();
      }
    }
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = char;
    onChange(next.join(""));
    if (char && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digits[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onFocus={(e) => e.target.select()}
          className="w-11 h-13 text-center text-xl font-bold rounded-xl border-2 border-border bg-secondary/30 
                     text-foreground focus:outline-none focus:border-primary focus:bg-background
                     transition-all duration-150 disabled:opacity-50"
          style={{ height: "3.25rem" }}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ─── Phone input ───────────────────────────────────────────── */
function PhoneInput({ value, onChange, disabled, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Phone className="h-4 w-4" />
      </span>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder || "+91 98765 43210"}
        className="w-full pl-10 pr-4 h-12 rounded-xl border-2 border-border bg-secondary/30 
                   text-foreground placeholder:text-muted-foreground/60 font-medium text-sm
                   focus:outline-none focus:border-primary focus:bg-background
                   transition-all duration-150 disabled:opacity-50"
      />
    </div>
  );
}

/* ─── Countdown ─────────────────────────────────────────────── */
function Countdown({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) { onDone(); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <span className="text-xs text-muted-foreground">
      Resend in <span className="font-semibold text-foreground">{left}s</span>
    </span>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { loginAdmin } = useAdmin();

  // role: "user" | "admin"
  const [role, setRole] = useState("user");
  // step: "phone" | "otp"
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const redirectTo = location.state?.from || (role === "admin" ? "/admin" : "/dashboard");

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setStep("phone");
    setPhone("");
    setOtp("");
    setSentOtp("");
    setError(null);
  };

  const handleSendOtp = async () => {
    setError(null);
    const cleaned = normalizePhone(phone);
    if (cleaned.replace(/\+/g, "").length < 10) {
      setError("Enter a valid phone number (min 10 digits).");
      return;
    }
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    const generated = sendOTP(cleaned);
    setSentOtp(generated);
    setCanResend(false);
    setLoading(false);
    setStep("otp");
    toast.success(`OTP sent to ${cleaned}`);
  };

  const handleVerifyOtp = async () => {
    setError(null);
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    // Demo: accept the generated OTP OR "123456" as fallback
    const valid = otp === sentOtp || otp === "123456";
    if (!valid) {
      setError("Incorrect OTP. Try again.");
      setLoading(false);
      return;
    }

    const cleaned = normalizePhone(phone);
    if (role === "admin") {
      const res = loginAdmin({ phone: cleaned, token: `admin-otp-${Date.now()}` });
      if (!res.ok) {
        setError(res.error || "Admin login failed.");
        setLoading(false);
        return;
      }
      toast.success("Welcome, Admin!");
      navigate("/admin", { replace: true });
    } else {
      login({ name: `User ${cleaned.slice(-4)}`, phone: cleaned, token: `user-otp-${Date.now()}` });
      toast.success("Logged in!");
      navigate(redirectTo, { replace: true });
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setOtp("");
    setError(null);
    setCanResend(false);
    await handleSendOtp();
  };

  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border/50 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => step === "otp" ? setStep("phone") : navigate("/")}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <span className="font-semibold text-sm text-foreground">
            {step === "otp" ? "Verify OTP" : "MedNav"}
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xl shadow-primary/5">

            {/* Role toggle */}
            <div className="flex rounded-xl border border-border bg-secondary/30 p-1 mb-8 gap-1">
              {[
                { key: "user", label: "User", Icon: Heart },
                { key: "admin", label: "Admin", Icon: Shield },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => handleRoleSwitch(key)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all duration-200
                    ${role === key
                      ? "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className={`h-4 w-4 ${key === "admin" && role === "admin" ? "text-foreground" : ""}`} />
                  {label}
                </button>
              ))}
            </div>

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl mb-4 shadow-lg
                  ${isAdmin ? "bg-foreground shadow-foreground/20" : "bg-primary shadow-primary/20"}`}
              >
                {isAdmin
                  ? <Shield className="h-7 w-7 text-background" />
                  : <Heart className="h-7 w-7 text-primary-foreground fill-primary-foreground" />
                }
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {step === "otp" ? "Enter OTP" : isAdmin ? "Admin Login" : "Welcome Back"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                {step === "otp"
                  ? `We sent a 6-digit code to ${normalizePhone(phone)}`
                  : isAdmin
                    ? "Restricted area — staff only"
                    : "Sign in with your mobile number"}
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step: phone */}
            <AnimatePresence mode="wait">
              {step === "phone" && (
                <motion.div
                  key="phone-step"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      {isAdmin ? "Admin Mobile Number" : "Mobile Number"}
                    </label>
                    <PhoneInput
                      value={phone}
                      onChange={setPhone}
                      disabled={loading}
                      placeholder={isAdmin ? "+91 99999 00000" : "+91 98765 43210"}
                    />
                  </div>
                  <Button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full h-12 text-base flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      <>Send OTP <ChevronRight className="h-4 w-4" /></>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {isAdmin
                      ? "Demo: any valid phone number → OTP shown in console"
                      : "Demo: any 10+ digit number → OTP shown in console"}
                  </p>
                </motion.div>
              )}

              {/* Step: OTP */}
              {step === "otp" && (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-6"
                >
                  <OTPInput value={otp} onChange={setOtp} disabled={loading} />

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="w-full h-12 text-base flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Verifying…
                      </span>
                    ) : (
                      isAdmin ? "Verify & Enter Admin" : "Verify & Login"
                    )}
                  </Button>

                  {/* Resend */}
                  <div className="text-center">
                    {canResend ? (
                      <button
                        onClick={handleResend}
                        className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Resend OTP
                      </button>
                    ) : (
                      <Countdown seconds={30} onDone={() => setCanResend(true)} />
                    )}
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Demo: use OTP from console, or type <span className="font-mono font-semibold">123456</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
