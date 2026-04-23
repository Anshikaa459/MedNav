import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";           // ← single page handles both roles
import Dashboard from "@/pages/Dashboard";
import RequestAmbulance from "@/pages/RequestAmbulance";
import NearbyHospitals from "@/pages/NearbyHospitals";
import TrackAmbulance from "@/pages/TrackAmbulance";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminHospitals from "@/pages/admin/AdminHospitals";
import AdminAmbulances from "@/pages/admin/AdminAmbulances";
import AdminReports from "@/pages/admin/AdminReports";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SonnerToaster />
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              <Route path="/" element={<Landing />} />

              {/* ── Unified login: user AND admin ── */}
              <Route path="/login"       element={<Login />} />
              <Route path="/admin/login" element={<Login />} />  {/* keeps old URLs working */}

              {/* ── User routes ── */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/request"   element={<ProtectedRoute><RequestAmbulance /></ProtectedRoute>} />
              <Route path="/hospitals" element={<ProtectedRoute><NearbyHospitals /></ProtectedRoute>} />
              <Route path="/track"     element={<ProtectedRoute><TrackAmbulance /></ProtectedRoute>} />

              {/* ── Admin routes ── */}
              <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="hospitals"  element={<AdminHospitals />} />
                <Route path="ambulances" element={<AdminAmbulances />} />
                <Route path="reports"    element={<AdminReports />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
