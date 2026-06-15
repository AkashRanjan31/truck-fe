import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DriverProvider, useDriver } from './context/DriverContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { setToken } from './services/api';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import Navbar from './components/Navbar';
import HeroSection from './components/ui/HeroSection';
import './App.css';

// Driver pages
const ReportPage    = lazy(() => import('./pages/ReportPage'));
const HistoryPage   = lazy(() => import('./pages/HistoryPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const ProfilePage   = lazy(() => import('./pages/ProfilePage'));
const SosAlertsPage = lazy(() => import('./pages/SosAlertsPage'));

// Legacy admin page (password-based, kept for backward compat)
const AdminPage     = lazy(() => import('./pages/AdminPage'));

// Role-based dashboards
const SuperAdminDashboard = lazy(() => import('./pages/dashboards/SuperAdminDashboard'));
const StateAdminDashboard = lazy(() => import('./pages/dashboards/StateAdminDashboard'));
const AuthorityDashboard  = lazy(() => import('./pages/dashboards/AuthorityDashboard'));

const PageFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
    <div className="spinner" />
  </div>
);

/* ── Driver animated routes ── */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<MapPage />} />
        <Route path="/report"     element={<div className="page-body"><ReportPage /></div>} />
        <Route path="/history"    element={<div className="page-body"><HistoryPage /></div>} />
        <Route path="/emergency"  element={<div className="page-body"><EmergencyPage /></div>} />
        <Route path="/sos-alerts" element={<div className="page-body"><SosAlertsPage /></div>} />
        <Route path="/profile"    element={<div className="page-body"><ProfilePage /></div>} />
        <Route path="*"           element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

/* ── Unauthenticated routes ── */
function UnauthRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="*"      element={<HeroSection />} />
      </Routes>
    </AnimatePresence>
  );
}

/* ── Role-based dashboard gate ── */
function RoleDashboard() {
  const { auth, loading } = useAuthContext();

  if (loading) return <PageFallback />;
  if (!auth) return <Navigate to="/login" replace />;

  // Restore JWT header on mount
  if (auth.token) setToken(auth.token);

  switch (auth.role) {
    case 'SUPER_ADMIN': return <SuperAdminDashboard />;
    case 'STATE_ADMIN':  return <StateAdminDashboard />;
    case 'AUTHORITY':    return <AuthorityDashboard />;
    default:             return <Navigate to="/" replace />;
  }
}

/* ── Driver gate ── */
function DriverRoutes() {
  const { driver, loading } = useDriver();

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div className="spinner" />
    </div>
  );

  if (!driver) return <UnauthRoutes />;

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">
        <Suspense fallback={<PageFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Legacy admin page */}
            <Route path="/admin" element={<AdminPage />} />

            {/* Role-based dashboards (JWT auth) */}
            <Route path="/dashboard/super-admin" element={<RoleDashboard />} />
            <Route path="/dashboard/state-admin"  element={<RoleDashboard />} />
            <Route path="/dashboard/authority"    element={<RoleDashboard />} />

            {/* Driver routes (legacy phone auth) */}
            <Route
              path="*"
              element={
                <DriverProvider>
                  <DriverRoutes />
                </DriverProvider>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
