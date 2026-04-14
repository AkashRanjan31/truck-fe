import { Link } from 'react-router-dom';
import { Menu, Truck } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getDefaultRoute } from '../../utils/roleUtils';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  return (
    <nav className="bg-slate-900 border-b border-slate-700/60 px-4 py-2.5 flex items-center justify-between shrink-0 z-50">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <Link to={getDefaultRoute(user?.role)} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-white text-base tracking-tight hidden sm:block">
            Truck<span className="text-orange-500">Alert</span>
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-white leading-none">{user?.name}</p>
          <p className="text-[10px] text-slate-400 capitalize mt-0.5">{user?.role?.replace(/_/g, ' ')}</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-orange-500/30">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
