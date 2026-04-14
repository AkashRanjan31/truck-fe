import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleBasedRoute from '../components/common/RoleBasedRoute';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { PageLoader } from '../components/common/Skeletons';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// ── Lazy-loaded pages ────────────────────────────────────────────────────────
const AuthPage             = lazy(() => import('../pages/auth/AuthPage'));
const VerifyOTPPage        = lazy(() => import('../pages/auth/VerifyOTPPage'));
const LandingPage          = lazy(() => import('../pages/LandingPage'));

// Driver
const MapPage              = lazy(() => import('../pages/driver/MapPage'));
const ReportPage           = lazy(() => import('../pages/driver/ReportPage'));
const HistoryPage          = lazy(() => import('../pages/driver/HistoryPage'));
const EmergencyPage        = lazy(() => import('../pages/driver/EmergencyPage'));
const ProfilePage          = lazy(() => import('../pages/driver/ProfilePage'));

// Admin
const SuperAdminDashboard  = lazy(() => import('../pages/admin/SuperAdminDashboard'));
const StateAdminDashboard  = lazy(() => import('../pages/admin/StateAdminDashboard'));
const ManageStatesPage     = lazy(() => import('../pages/admin/ManageStatesPage'));
const ManageStateAdminsPage= lazy(() => import('../pages/admin/ManageStateAdminsPage'));
const ManageDriversPage    = lazy(() => import('../pages/admin/ManageDriversPage'));
const ManageReportsPage    = lazy(() => import('../pages/admin/ManageReportsPage'));
const AnalyticsPage        = lazy(() => import('../pages/admin/AnalyticsPage'));
const AuthoritiesPage      = lazy(() => import('../pages/admin/AuthoritiesPage'));
const VerifyDriversPage    = lazy(() => import('../pages/admin/VerifyDriversPage'));

// Authority
const AuthorityDashboard   = lazy(() => import('../pages/authority/AuthorityDashboard'));
const AuthorityDriversPage = lazy(() => import('../pages/authority/AuthorityDriversPage'));
const DriverDetailPage     = lazy(() => import('../pages/authority/DriverDetailPage'));
const AuthorityReportsPage = lazy(() => import('../pages/authority/AuthorityReportsPage'));
const AssignedAlertsPage   = lazy(() => import('../pages/authority/AssignedAlertsPage'));
const ActiveEmergenciesPage= lazy(() => import('../pages/authority/ActiveEmergenciesPage'));

// ── Wrapper: Suspense + ErrorBoundary per route ──────────────────────────────
const Page = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Page><LandingPage /></Page>} />

    <Route element={<Page><AuthLayout /></Page>}>
      <Route path="/auth"        element={<AuthPage />} />
      <Route path="/verify-otp"  element={<VerifyOTPPage />} />
    </Route>

    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      {/* Driver */}
      <Route path="/driver/map"       element={<Page><RoleBasedRoute roles={['driver']}><MapPage /></RoleBasedRoute></Page>} />
      <Route path="/driver/report"    element={<Page><RoleBasedRoute roles={['driver']}><ReportPage /></RoleBasedRoute></Page>} />
      <Route path="/driver/history"   element={<Page><RoleBasedRoute roles={['driver']}><HistoryPage /></RoleBasedRoute></Page>} />
      <Route path="/driver/emergency" element={<Page><RoleBasedRoute roles={['driver']}><EmergencyPage /></RoleBasedRoute></Page>} />
      <Route path="/driver/profile"   element={<Page><RoleBasedRoute roles={['driver']}><ProfilePage /></RoleBasedRoute></Page>} />

      {/* Super Admin */}
      <Route path="/admin/dashboard"       element={<Page><RoleBasedRoute roles={['super_admin']}><SuperAdminDashboard /></RoleBasedRoute></Page>} />
      <Route path="/admin/states"          element={<Page><RoleBasedRoute roles={['super_admin']}><ManageStatesPage /></RoleBasedRoute></Page>} />
      <Route path="/admin/state-admins"    element={<Page><RoleBasedRoute roles={['super_admin']}><ManageStateAdminsPage /></RoleBasedRoute></Page>} />
      <Route path="/admin/authorities"     element={<Page><RoleBasedRoute roles={['super_admin', 'state_admin']}><AuthoritiesPage /></RoleBasedRoute></Page>} />

      {/* State Admin + Super Admin */}
      <Route path="/admin/state-dashboard" element={<Page><RoleBasedRoute roles={['state_admin', 'super_admin']}><StateAdminDashboard /></RoleBasedRoute></Page>} />
      <Route path="/admin/drivers"         element={<Page><RoleBasedRoute roles={['state_admin', 'super_admin']}><ManageDriversPage /></RoleBasedRoute></Page>} />
      <Route path="/admin/reports"         element={<Page><RoleBasedRoute roles={['state_admin', 'super_admin', 'authority']}><ManageReportsPage /></RoleBasedRoute></Page>} />
      <Route path="/admin/analytics"       element={<Page><RoleBasedRoute roles={['state_admin', 'super_admin']}><AnalyticsPage /></RoleBasedRoute></Page>} />
      <Route path="/admin/verify-drivers"  element={<Page><RoleBasedRoute roles={['state_admin', 'super_admin']}><VerifyDriversPage /></RoleBasedRoute></Page>} />

      {/* Authority */}
      <Route path="/authority/dashboard"        element={<Page><RoleBasedRoute roles={['authority']}><AuthorityDashboard /></RoleBasedRoute></Page>} />
      <Route path="/authority/drivers"          element={<Page><RoleBasedRoute roles={['authority']}><AuthorityDriversPage /></RoleBasedRoute></Page>} />
      <Route path="/authority/driver/:driverId" element={<Page><RoleBasedRoute roles={['authority']}><DriverDetailPage /></RoleBasedRoute></Page>} />
      <Route path="/authority/reports"          element={<Page><RoleBasedRoute roles={['authority']}><AuthorityReportsPage /></RoleBasedRoute></Page>} />
      <Route path="/authority/alerts"           element={<Page><RoleBasedRoute roles={['authority']}><AssignedAlertsPage /></RoleBasedRoute></Page>} />
      <Route path="/authority/emergencies"      element={<Page><RoleBasedRoute roles={['authority']}><ActiveEmergenciesPage /></RoleBasedRoute></Page>} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
