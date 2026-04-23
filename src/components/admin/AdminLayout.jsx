import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Ambulance, BarChart3,
  Bell, LogOut, Shield, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/hospitals", label: "Manage Hospitals", icon: Building2 },
  { to: "/admin/ambulances", label: "Manage Ambulances", icon: Ambulance },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function AdminLayout() {
  const { admin, logoutAdmin, requests } = useAdmin();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pending = requests.filter((r) => r.status === "Pending").length;

  const handleLogout = () => {
    logoutAdmin();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 border-r border-border bg-card transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground">
            <Shield className="h-4 w-4 text-background" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-foreground">MedNav</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin Console</p>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <n.icon className="h-4 w-4" />
              <span className="flex-1">{n.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h2 className="font-display text-base md:text-lg font-semibold text-foreground">
              Admin Console
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-lg hover:bg-secondary">
                  <Bell className="h-5 w-5 text-foreground" />
                  {pending > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {requests.slice(0, 4).map((r) => (
                  <DropdownMenuItem key={r.id} className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium">{r.patient} — {r.type}</span>
                    <span className="text-xs text-muted-foreground">{r.location} · {r.createdAt}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex flex-col items-end leading-tight">
              <p className="text-sm font-medium text-foreground">{admin?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground">{admin?.email}</p>
            </div>

            <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
