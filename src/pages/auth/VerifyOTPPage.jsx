import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { verifyOTP } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import { getDefaultRoute } from '../../utils/roleUtils';
import OTPForm from '../../components/auth/OTPForm';
import ResendOTP from '../../components/auth/ResendOTP';

const VerifyOTPPage = () => {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const type  = params.get('type')  || 'login';
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (otp) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await verifyOTP(email, otp);
      loginUser(data.data.user, data.data.token);
      toast.success('Verified! Welcome to TruckAlert');
      navigate(getDefaultRoute(data.data.user.role));
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
          style={{
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.3)',
            boxShadow: '0 0 20px rgba(249,115,22,0.15)',
          }}
        >
          <Mail className="w-6 h-6 text-orange-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white">Check Your Gmail</h3>
        <p className="text-slate-500 text-sm mt-1">We sent a 6-digit OTP to</p>
        <p className="text-orange-400 font-semibold text-sm mt-0.5 truncate">{email}</p>
      </div>

      {/* OTP input */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-slate-400 text-sm">Verifying...</p>
          </motion.div>
        ) : (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <OTPForm onSubmit={handleSubmit} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl p-3 text-center"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="text-center space-y-1">
        <p className="text-xs text-slate-600">
          OTP expires in <span className="text-orange-400 font-semibold">5 minutes</span> · Max 3 attempts
        </p>
        <ResendOTP email={email} type={type} />
      </div>

      {/* Back */}
      <button onClick={() => navigate('/auth')}
        className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
        style={{ border: '1px solid rgba(51,65,85,0.5)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </button>
    </motion.div>
  );
};

export default VerifyOTPPage;
