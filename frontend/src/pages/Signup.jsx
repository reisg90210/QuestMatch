import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.signup({ username, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
      <img src="/assets/questmatch-logo.png" className="w-24 h-24 mb-6" alt="QuestMatch" />
      <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
        Join QuestMatch
      </h1>
      <p className="text-[#94a3b8] text-center mt-2">Find your gaming partners today</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-8 space-y-4">
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center border border-red-500/30">{error}</div>}
        
        <input
          type="text"
          placeholder="Username"
          className="w-full px-5 py-4 bg-[#1e1e32] border border-[#2a2a3e] rounded-2xl text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c3aed] transition-colors"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-5 py-4 bg-[#1e1e32] border border-[#2a2a3e] rounded-2xl text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c3aed] transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-5 py-4 bg-[#1e1e32] border border-[#2a2a3e] rounded-2xl text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c3aed] transition-colors"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button 
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-2xl text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
        >
          Create Account
        </button>
        
        <p className="text-center text-[#64748b] text-sm">
          Already have an account? <Link to="/login" className="text-[#06b6d4]">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
