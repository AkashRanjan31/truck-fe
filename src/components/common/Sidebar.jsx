import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, FileText, Clock, AlertTriangle, User,
  LayoutDashboard, Globe, Truck, BarChart2, Shield,
  Bell, Siren, LogOut, BadgeCheck,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const navConfig = {
  driver: [
    { to: '/driver/map',       label: 'Map',       Icon: Map,           desc: 'Live map' },
    { to: '/driver/report',    label: 'Report',    Icon: FileText,      desc: 'Report issue' },
    { to: '/driver/history',   label: 'History',   Icon: Clock,         desc: 'My reports' },
    { to: '/driver/emergency', label: 'Emergency', Icon: Siren,         desc: 'SOS & help' },
    { to: '/driver/profile',   label: 'Profile',   Icon: User,          desc: 'My account' },
  ],
  super_admin: [
    { to: '/admin/dashboard',       label: 'Dashboard',   Icon: LayoutDashboard, desc: 'Overview' },
    { to: '/admin/states',          label: 'States',      Icon: Globe,           desc: 'Manage states' },
    { to: '/admin/state-admins',    label: 'State Admins',Icon: BadgeCheck,      desc: 'All state admin accounts' },
    { to: '/admin/verify-drivers',  label: 'Verify',      Icon: BadgeCheck,      desc: 'Driver verification' },
    { to: '/admin/drivers',         label: 'Drivers',     Icon: Truck,           desc: 'All drivers' },
    { to: '/admin/reports',         label: 'Reports',     Icon: FileText,        desc: 'All reports' },
    { to: '/admin/analytics',       label: 'Analytics',   Icon: BarChart2,       desc: 'Charts & stats' },
    { to: '/admin/authorities',     label: 'Authorities', Icon: Shield,          desc: 'Police & hospitals' },
  ],
  state_admin: [
    { to: '/admin/state-dashboard', label: 'Dashboard',   Icon: LayoutDashboard, desc: 'State overview' },
    { to: '/admin/verify-drivers',  label: 'Verify',      Icon: BadgeCheck,      desc: 'Verify drivers' },
    { to: '/admin/drivers',         label: 'Drivers',     Icon: Truck,           desc: 'State drivers' },
    { to: '/admin/reports',         label: 'Reports',     Icon: FileText,        desc: 'State reports' },
    { to: '/admin/analytics',       label: 'Analytics',   Icon: BarChart2,       desc: 'Analytics' },
    { to: '/admin/authorities',     label: 'Authorities', Icon: Shield,          desc: 'Authorities' },
  ],
  authority: [
    { to: '/authority/dashboard',   label: 'Dashboard',   Icon: LayoutDashboard, desc: 'Overview & stats' },
    { to: '/authority/drivers',     label: 'Drivers',     Icon: Truck,           desc: 'Drivers in your state' },
    { to: '/authority/reports',     label: 'Reports',     Icon: FileText,        desc: 'State reports' },
    { to: '/authority/alerts',      label: 'Alerts',      Icon: Bell,            desc: 'Assigned alerts' },
    { to: '/authority/emergencies', label: 'Emergencies', Icon: AlertTriangle,   desc: 'Active emergencies' },
  ],
};

const linkVariants = {
  initial: { opacity: 0, x: -10 },
  animate: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.2, ease: 'easeOut' } }),
};

const SidebarPanel = ({ onClose }) => {
  const { user, logoutUser } = useAuth();
  const links = navConfig[user?.role] || [];

  return (
    <div className="w-56 h-full bg-slate-900 border-r border-slate-700/60 flex flex-col overflow-hidden">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-700/60 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
          <Truck className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-black text-white text-base leading-none">
            Truck<span className="text-orange-500">Alert</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Driver Safety Network</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-lg shadow-orange-500/20"
          >
            {user?.name?.[0]?.toUpperCase()}
          </motion.div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-400 capitalize mt-0.5">{user?.role?.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold px-3 mb-2">Navigation</p>
        {links.map(({ to, label, Icon, desc }, i) => {
          const isEmergencyLink = to.includes('emergency');
          return (
            <motion.div key={to} custom={i} variants={linkVariants} initial="initial" animate="animate">
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                  ${isActive
                    ? isEmergencyLink
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                    : isEmergencyLink
                      ? 'text-slate-400 hover:text-red-300 hover:bg-red-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActiveBar"
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full ${isEmergencyLink ? 'bg-red-400' : 'bg-orange-400'}`}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="block leading-tight">{label}</span>
                      <span className="block text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors leading-tight mt-0.5">{desc}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${isEmergencyLink ? 'bg-red-400' : 'bg-orange-400'}`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-slate-700/60 shrink-0">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={logoutUser}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <span className="block leading-tight">Logout</span>
            <span className="block text-[10px] text-slate-500 leading-tight mt-0.5">Sign out</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen = false, onClose = () => {}, variant = 'mobile' }) => {
  if (variant === 'desktop') return <SidebarPanel onClose={onClose} />;
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/60 z-20 backdrop-blur-sm" onClick={onClose} />
        )}
      </AnimatePresence>
      <motion.div className="fixed top-0 left-0 h-full z-30" initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <SidebarPanel onClose={onClose} />
      </motion.div>
    </>
  );
};

export default Sidebar;
