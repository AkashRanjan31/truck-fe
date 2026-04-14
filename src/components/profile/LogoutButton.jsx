import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LogoutButton = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  return (
    <button onClick={handleLogout} className="btn-danger w-full">
      🚪 Logout
    </button>
  );
};

export default LogoutButton;
