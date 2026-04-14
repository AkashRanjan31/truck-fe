import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { SOCKET_URL } from '../utils/constants';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token },
    });

    s.emit('join_user', user._id);
    // Extract ObjectId string safely from populated or raw state field
    const userStateId = user.state?._id?.toString() || user.state?.toString();
    if (userStateId) s.emit('join_state', userStateId);

    s.on('notification', (n) => {
      setNotifications((prev) => [n, ...prev]);
      setUnreadCount((c) => c + 1);
      toast.info(`🔔 ${n.title}`, { autoClose: 5000 });
    });

    s.on('new_alert', (alert) => {
      toast.warning(`🚨 ${alert.title}`, { autoClose: 8000 });
    });

    s.on('sos_alert', ({ alert }) => {
      toast.error(`🆘 SOS EMERGENCY: ${alert.message}`, { autoClose: false });
    });

    s.on('broadcast_alert', (alert) => {
      toast.warning(`📢 ${alert.title}: ${alert.message}`, { autoClose: 10000 });
    });

    s.on('state_crossing', ({ toState }) => {
      toast.info(`🗺️ Entered ${toState?.name}`, { autoClose: 6000 });
    });

    setSocket(s);
    return () => s.disconnect();
  }, [user?._id]);

  const markAllRead = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, socket, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
