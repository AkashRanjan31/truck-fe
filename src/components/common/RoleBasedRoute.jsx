import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getDefaultRoute } from '../../utils/roleUtils';

const RoleBasedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (!roles.includes(user.role)) return <Navigate to={getDefaultRoute(user.role)} replace />;
  return children;
};

export default RoleBasedRoute;
