import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.login({ email, password });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 font-inter">
      <div className="flex items-center gap-3 mb-8">
        <img src="/logo.svg" className="w-16 h-16 shadow-[0_0_20px_rgba(0,245,255,0.2)]" alt="QuestMatch" />
        <h1 className="text-5xl font-rajdhani font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase tracking-tighter">
          QuestMatch
        </h1>
      </div>
      
      <div className="w-full max-w-md bg-surface p-8 rounded-[2rem] border border-background shadow-2xl">
        <h2 className="text-2xl font-rajdhani font-bold text-text-high mb-2 uppercase tracking-wide">Commander Login</h2>
        <p className="text-text-low text-sm mb-8">Access the tactical network to find your squad.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-alert/10 text-alert p-4 rounded-xl text-sm text-center border border-alert/20 font-bold uppercase tracking-widest">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-low uppercase tracking-[0.2em] ml-2">Email Address</label>
            <input
              type="email"
              placeholder="e.g. striker@questmatch.io"
              className="w-full px-6 py-4 bg-background border border-surface rounded-xl text-text-high text-base placeholder:text-text-low/30 focus:outline-none focus:border-primary transition-colors shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-low uppercase tracking-[0.2em] ml-2">Security Key</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-background border border-surface rounded-xl text-text-high text-base placeholder:text-text-low/30 focus:outline-none focus:border-primary transition-colors shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-5 bg-primary text-background rounded-xl font-rajdhani font-bold text-xl uppercase tracking-[0.1em] hover:brightness-110 transition shadow-lg shadow-primary/20 mt-4"
          >
            Authenticate
          </button>
          
          <div className="pt-6 flex flex-col items-center gap-4">
            <p className="text-center text-text-low text-xs font-medium uppercase tracking-widest">
              New Recruit? <Link to="/signup" className="text-primary hover:underline underline-offset-4">Join the initiative</Link>
            </p>
            <Link to="/" className="text-text-low/40 text-[10px] uppercase font-bold hover:text-text-low transition-colors">
              Return to Base
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
