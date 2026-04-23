import { createContext, useContext, useEffect, useState } from "react";
import { hospitals as seedHospitals, ambulances as seedAmbulances } from "@/data/mockData";

const AdminContext = createContext(undefined);

const seedUsers = [
  { id: "U001", name: "Aarav Sharma",  phone: "+91 98765 11111", status: "Active",    joinedAt: "2024-01-12" },
  { id: "U002", name: "Diya Patel",    phone: "+91 98765 22222", status: "Active",    joinedAt: "2024-02-04" },
  { id: "U003", name: "Rohan Mehta",   phone: "+91 98765 33333", status: "Suspended", joinedAt: "2024-02-21" },
  { id: "U004", name: "Isha Verma",    phone: "+91 98765 44444", status: "Active",    joinedAt: "2024-03-08" },
  { id: "U005", name: "Kabir Singh",   phone: "+91 98765 55555", status: "Active",    joinedAt: "2024-03-19" },
];

const seedRequests = [
  { id: "R001", patient: "Aarav Sharma", phone: "+91 98765 11111", location: "Bandra West, Mumbai",    type: "Cardiac",  priority: "Critical", status: "Assigned",  ambulanceId: "A001", createdAt: "2 min ago" },
  { id: "R002", patient: "Diya Patel",   phone: "+91 98765 22222", location: "Connaught Place, Delhi", type: "Trauma",   priority: "High",     status: "Pending",   createdAt: "5 min ago" },
  { id: "R003", patient: "Rohan Mehta",  phone: "+91 98765 33333", location: "Indiranagar, Bangalore", type: "General",  priority: "Medium",   status: "Completed", ambulanceId: "A003", createdAt: "1 hr ago" },
  { id: "R004", patient: "Isha Verma",   phone: "+91 98765 44444", location: "Koregaon Park, Pune",    type: "Maternity",priority: "High",     status: "Assigned",  ambulanceId: "A004", createdAt: "20 min ago" },
  { id: "R005", patient: "Kabir Singh",  phone: "+91 98765 55555", location: "T. Nagar, Chennai",      type: "Pediatric",priority: "Critical", status: "Pending",   createdAt: "1 min ago" },
];

/**
 * Authorised admin phone numbers.
 * In production, validate server-side.
 */
const ADMIN_PHONES = new Set([
  "+919999900000",
  "+911234567890",
]);

function genId(prefix) {
  return `${prefix}${Math.floor(Math.random() * 9000 + 1000)}`;
}

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLS = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const [hospitals,  setHospitals]  = useState(() => loadLS("admin:hospitals",  seedHospitals));
  const [ambulances, setAmbulances] = useState(() => loadLS("admin:ambulances", seedAmbulances));
  const [users,      setUsers]      = useState(() => loadLS("admin:users",      seedUsers));
  const [requests,   setRequests]   = useState(() => loadLS("admin:requests",   seedRequests));

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin");
      if (raw) setAdmin(JSON.parse(raw));
    } catch {
      localStorage.removeItem("admin");
    }
    setLoading(false);
  }, []);

  useEffect(() => { localStorage.setItem("admin:hospitals",  JSON.stringify(hospitals));  }, [hospitals]);
  useEffect(() => { localStorage.setItem("admin:ambulances", JSON.stringify(ambulances)); }, [ambulances]);
  useEffect(() => { localStorage.setItem("admin:users",      JSON.stringify(users));      }, [users]);
  useEffect(() => { localStorage.setItem("admin:requests",   JSON.stringify(requests));   }, [requests]);

  /**
   * Called after OTP is verified on the unified Login page.
   * @param {{ phone: string, token: string }} param0
   */
  const loginAdmin = ({ phone, token }) => {
    // Normalise: strip spaces/dashes, ensure leading +91 check is flexible
    const cleaned = phone.replace(/[\s\-()]/g, "");

    // Demo mode: accept ANY phone (since OTP already verified).
    // In production: check against a DB / authorised list server-side.
    const authorised = true; // <- replace with: ADMIN_PHONES.has(cleaned)

    if (!authorised) {
      return { ok: false, error: "This number is not authorised as admin." };
    }

    const a = { phone: cleaned, name: "Admin", token };
    localStorage.setItem("admin", JSON.stringify(a));
    setAdmin(a);
    return { ok: true };
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  return (
    <AdminContext.Provider
      value={{
        admin, loading, loginAdmin, logoutAdmin,
        hospitals,
        addHospital:    (h) => setHospitals((p)  => [{ ...h,  id: genId("H") }, ...p]),
        updateHospital: (id, h) => setHospitals((p) => p.map((x) => (x.id === id ? { ...x, ...h } : x))),
        deleteHospital: (id)    => setHospitals((p) => p.filter((x) => x.id !== id)),
        ambulances,
        addAmbulance:    (a) => setAmbulances((p) => [{ ...a, id: genId("A") }, ...p]),
        updateAmbulance: (id, a) => setAmbulances((p) => p.map((x) => (x.id === id ? { ...x, ...a } : x))),
        deleteAmbulance: (id)    => setAmbulances((p) => p.filter((x) => x.id !== id)),
        users,
        addUser:    (u) => setUsers((p) => [{ ...u, id: genId("U"), joinedAt: new Date().toISOString().slice(0, 10) }, ...p]),
        updateUser: (id, u) => setUsers((p) => p.map((x) => (x.id === id ? { ...x, ...u } : x))),
        deleteUser: (id)    => setUsers((p) => p.filter((x) => x.id !== id)),
        requests,
        addRequest:    (r) => setRequests((p) => [{ ...r, id: genId("R"), createdAt: "just now" }, ...p]),
        updateRequest: (id, r) => setRequests((p) => p.map((x) => (x.id === id ? { ...x, ...r } : x))),
        deleteRequest: (id)    => setRequests((p) => p.filter((x) => x.id !== id)),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
