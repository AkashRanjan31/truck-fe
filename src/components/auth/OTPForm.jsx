import { useRef, useState } from 'react';

const OTPForm = ({ onSubmit, loading }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
    if (next.every(Boolean)) onSubmit(next.join(''));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
      onSubmit(pasted);
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={loading}
          className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200
            bg-slate-900 text-white outline-none
            ${digit ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-slate-600'}
            focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20
            disabled:opacity-50`}
        />
      ))}
    </div>
  );
};

export default OTPForm;
