import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" placeholder="Email" required className="w-full border rounded-lg p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full border rounded-lg p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full btn-primary">Login</button>
        </form>
        <p className="mt-4 text-center">New here? <Link to="/register" className="text-primary font-semibold">Create Account</Link></p>
        <p className="mt-2 text-center text-sm text-gray-500">Admin: admin@citythreads.com / Admin123!</p>
      </motion.div>
    </div>
  );
};

export default Login;