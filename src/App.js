import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DriverProvider, useDriver } from './context/DriverContext';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import Navbar from './components/Navbar';
import HeroSection from './components/ui/HeroSection';
import './App.css';

// Lazy-load non-critical pages
const ReportPage    = lazy(() => import('./pages/ReportPage'));
const HistoryPage   = lazy(() => import('./pages/HistoryPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const ProfilePage   = lazy(() => import('./pages/ProfilePage'));
const SosAlertsPage = lazy(() => import('./pages/SosAlertsPage'));
const AdminPage     = lazy(() => import('./pages/AdminPage'));

const PageFallback = () => (
  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%', background:'var(--bg)' }}>
    <div className="spinner" />
  </div>
);

/* ── Animated inner routes (authenticated) ── */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<MapPage />} />
        <Route path="/report"    element={<div className="page-body"><ReportPage /></div>} />
        <Route path="/history"   element={<div className="page-body"><HistoryPage /></div>} />
        <Route path="/emergency" element={<div className="page-body"><EmergencyPage /></div>} />
        <Route path="/sos-alerts" element={<div className="page-body"><SosAlertsPage /></div>} />
        <Route path="/profile"   element={<div className="page-body"><ProfilePage /></div>} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

/* ── Unauthenticated routes: landing + login ── */
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

/* ── Main gate: loading spinner, auth check, shell ── */
function DriverRoutes() {
  const { driver, loading } = useDriver();

  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'var(--bg)' }}>
        <div className="spinner" />
      </div>
    );
  }

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
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
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
    </BrowserRouter>
  );
}
