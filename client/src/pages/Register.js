import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">Join CityThreads</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Full Name" required className="w-full border rounded-lg p-3" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" required className="w-full border rounded-lg p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full border rounded-lg p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full btn-primary">Sign Up</button>
        </form>
        <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;