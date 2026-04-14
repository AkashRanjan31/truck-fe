import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';

const AuthPage = () => {
  const [tab, setTab] = useState('login');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Heading */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">
          {tab === 'login' ? 'Welcome back' : 'Create account'}
        </h3>
        <p className="text-slate-500 text-sm mt-0.5">
          {tab === 'login'
            ? 'Sign in to your driver account'
            : 'Join the safety network today'}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex p-1 rounded-xl mb-6"
        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)' }}>
        {['login', 'register'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative flex-1 py-2.5 text-sm font-semibold capitalize rounded-lg transition-colors z-10"
            style={{ color: tab === t ? '#fff' : '#64748b' }}
          >
            {tab === t && (
              <motion.div
                layoutId="authTabBg"
                className="absolute inset-0 rounded-lg"
                style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t}</span>
          </button>
        ))}
      </div>

      {/* Form with slide animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: tab === 'login' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: tab === 'login' ? 20 : -20 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </motion.div>
      </AnimatePresence>

      {/* Switch hint */}
      <p className="text-center text-slate-600 text-xs mt-5">
        {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
          className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
        >
          {tab === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </motion.div>
  );
};

export default AuthPage;
