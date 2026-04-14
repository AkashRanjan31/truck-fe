import { useState, useEffect } from 'react';
import { resendOTP } from '../../services/authService';
import { toast } from 'react-toastify';

const ResendOTP = ({ email, type = 'login' }) => {
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendOTP(email, type);
      toast.success('New OTP sent to your Gmail!');
      setCountdown(30);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center text-sm">
      {countdown > 0 ? (
        <p className="text-slate-500">
          Resend OTP in{' '}
          <span className="text-orange-400 font-semibold tabular-nums">{countdown}s</span>
        </p>
      ) : (
        <button
          onClick={handleResend}
          disabled={loading}
          className="text-orange-400 hover:text-orange-300 font-semibold hover:underline transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Resend OTP'}
        </button>
      )}
    </div>
  );
};

export default ResendOTP;
