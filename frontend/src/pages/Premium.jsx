import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, ShieldCheck, Star, Users, Rocket, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { users } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Premium = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await users.upgrade('premium');
      // Update local storage and context
      const updatedUser = { ...user, is_premium: true };
      login(updatedUser, localStorage.getItem('token'));
      alert('Welcome to the Elite, Questor!');
      navigate('/profile');
    } catch (err) {
      console.error('Upgrade failed', err);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: "Elite Visibility",
      description: "Your quests appear at the top of every radar scan."
    },
    {
      icon: ShieldCheck,
      title: "Verified Status",
      description: "Get the Electric Cyan badge to build instant squad trust."
    },
    {
      icon: Star,
      title: "Advanced Filters",
      description: "Filter by exact Playstyle, Rank History, and Win Rate."
    },
    {
      icon: Users,
      title: "Squad Boost",
      description: "Priority matching for your active quest squads."
    }
  ];

  return (
    <div className="flex-1 bg-obsidian overflow-y-auto pb-28 pt-12 px-6">
      <div className="max-w-md mx-auto text-center space-y-12">
        {/* Hero */}
        <div className="space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary/10 border border-secondary text-secondary font-bold text-xs uppercase tracking-[0.2em]"
          >
            <Zap size={14} fill="currentColor" />
            Elite Questor
          </motion.div>
          <h1 className="text-5xl font-rajdhani font-black text-white uppercase tracking-tighter leading-none">
            UNLEASH THE <span className="text-primary italic">ELITE</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Upgrade your tactical capabilities and find the ultimate squad.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 text-left">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-4 bg-obsidian-light rounded-2xl border border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <benefit.icon size={24} />
              </div>
              <div>
                <h3 className="text-white font-rajdhani font-bold uppercase tracking-wide">{benefit.title}</h3>
                <p className="text-slate-500 text-sm">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-primary to-secondary p-[2px] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,255,255,0.2)]"
        >
          <div className="bg-obsidian rounded-[2.4rem] p-10 space-y-8">
            <div className="space-y-1">
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Full Access</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-rajdhani font-black text-white">$9.99</span>
                <span className="text-slate-500 font-bold">/MO</span>
              </div>
            </div>
            
            <button 
              onClick={handleUpgrade}
              disabled={loading || user?.is_premium}
              className="w-full py-5 bg-primary text-obsidian font-black rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : user?.is_premium ? "ALREADY ELITE" : "INITIATE UPGRADE"}
            </button>
            
            <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">
              Cancel anytime • Instant activation
            </p>
          </div>
        </motion.div>

        <button 
          onClick={() => navigate(-1)}
          className="text-slate-500 font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
        >
          Return to Base
        </button>
      </div>
    </div>
  );
};

export default Premium;
