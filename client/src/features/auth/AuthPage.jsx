import React, { useState, useContext } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success('Account created successfully!');
      }
    } catch (error) {
      toast.error(error.message || error.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" data-testid="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light tracking-tight mb-2" data-testid="auth-title">
              LifeOS AI
            </h1>
            <p className="text-sm text-slate-400">
              Your personal productivity operating system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="auth-form">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" data-testid="name-label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all w-full"
                  placeholder="John Doe"
                  required={!isLogin}
                  data-testid="name-input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" data-testid="email-label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all w-full"
                placeholder="you@example.com"
                required
                data-testid="email-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" data-testid="password-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all w-full"
                placeholder="••••••••"
                required
                data-testid="password-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-6 py-3 font-medium transition-colors focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
              data-testid="auth-submit-button"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-400 hover:text-white transition-colors"
              data-testid="auth-toggle-button"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
