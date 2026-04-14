import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><Loader size="lg" /></div>;
  return user ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
