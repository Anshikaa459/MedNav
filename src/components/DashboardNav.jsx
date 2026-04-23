import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, LayoutDashboard, Building2, Ambulance, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hospitals", label: "Hospitals", icon: Building2 },
  { to: "/request", label: "Request", icon: Ambulance },
  { to: "/track", label: "Track", icon: MapPin },
];

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-3">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground tracking-tight">MedNav</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground leading-tight">{user.phone}</p>
            </div>
          )}
          <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
