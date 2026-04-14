import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">

      {/*
        DESKTOP sidebar — static, always visible, part of flex flow.
        Hidden on screens smaller than lg.
      */}
      <div className="hidden lg:block lg:flex-shrink-0">
        <Sidebar variant="desktop" />
      </div>

      {/*
        MOBILE sidebar — fixed overlay, only visible when mobileOpen=true.
        Hidden on lg+ screens (the desktop one takes over).
      */}
      <Sidebar
        variant="mobile"
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content area — takes all remaining width */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar — hamburger only visible on mobile */}
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-slate-900">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
