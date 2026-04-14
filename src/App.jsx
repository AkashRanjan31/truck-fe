import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <NotificationProvider>
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable={false}
              theme="dark"
              toastStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }}
              limit={5}
            />
          </NotificationProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
