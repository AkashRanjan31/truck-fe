import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Map, AlertTriangle, ClipboardList, ShieldAlert,
  Bell, User, Truck, LogOut
} from 'lucide-react';
import { useDriver } from '../context/DriverContext';
import { connectSocket } from '../services/socket';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',           Icon: Map,           label: 'Live Map',   end: true },
  { to: '/report',     Icon: AlertTriangle,  label: 'Report' },
  { to: '/history',    Icon: ClipboardList,  label: 'History' },
  { to: '/emergency',  Icon: ShieldAlert,    label: 'Emergency' },
  { to: '/sos-alerts', Icon: Bell,           label: 'SOS Alerts', badge: true },
  { to: '/profile',    Icon: User,           label: 'Profile' },
];

const sidebarVariants = {
  hidden: { x: -240, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const linkVariants = {
  hidden:  { x: -20, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, delay: 0.1 + i * 0.05, ease: 'easeOut' }
  })
};

export default function Navbar() {
  const { driver, logout } = useDriver();
  const navigate   = useNavigate();
  const [sosBadge, setSosBadge] = useState(0);

  useEffect(() => {
    if (!driver?._id) return;
    const socket = connectSocket(driver._id);
    const inc = () => setSosBadge((n) => n + 1);
    socket.on('sos_nearby',      inc);
    socket.on('emergency_alert', inc);
    return () => { socket.off('sos_nearby', inc); socket.off('emergency_alert', inc); };
  }, [driver?._id]);

  return (
    <motion.aside
      className="sidebar"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Brand */}
      <div className="sidebar-brand" onClick={() => navigate('/')}>
        <span className="sidebar-brand-icon">
          <Truck size={24} className="brand-truck-icon" />
        </span>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Truck Alert</span>
          <span className="sidebar-brand-sub">Safety Network</span>
        </div>
        <span className="sidebar-brand-dot" />
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Navigation</p>
        {NAV_LINKS.map((l, i) => (
          <motion.div
            key={l.to}
            custom={i}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
          >
            <NavLink
              to={l.to}
              end={l.end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => { if (l.badge) setSosBadge(0); }}
            >
              <span className="sl-icon-wrap">
                <l.Icon size={17} />
              </span>
              <span className="sl-label">{l.label}</span>
              {l.badge && sosBadge > 0 && (
                <span className="sl-badge">{sosBadge}</span>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Driver info */}
      <div className="sidebar-footer">
        <div className="sidebar-driver">
          <div className="sd-avatar">
            <User size={16} />
          </div>
          <div className="sd-info">
            <span className="sd-name">{driver?.name}</span>
            <span className="sd-truck">{driver?.truckNumber}</span>
          </div>
          <span className="sd-online" title="Online" />
        </div>
        <button
          className="sidebar-logout"
          onClick={logout}
          title="Sign out"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}
