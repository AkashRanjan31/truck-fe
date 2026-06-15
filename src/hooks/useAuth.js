import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { auth, login, logout, updateAuth, loading } = useAuthContext();

  return { auth, login, logout, updateAuth, loading, isAuthenticated: !!auth };
};
