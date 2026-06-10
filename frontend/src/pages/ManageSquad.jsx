import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Check, 
  X, 
  ChevronLeft, 
  ShieldCheck, 
  Trophy,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react';
import { quests as questsApi, applications as appsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VerifiedBadge from '../components/VerifiedBadge';

const ManageSquad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quest, setQuest] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questRes, appsRes] = await Promise.all([
          questsApi.getById(id),
          questsApi.getApplications(id)
        ]);
        setQuest(questRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error('Failed to fetch squad data:', err);
        setError('Could not retrieve squad management data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateStatus = async (appId, status) => {
    try {
      // Optimistic UI update
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status } : app
      ));
      
      await appsApi.updateStatus(appId, status);
      
      // Refresh data to ensure accuracy
      const appsRes = await questsApi.getApplications(id);
      setApplications(appsRes.data);
      
      const questRes = await questsApi.getById(id);
      setQuest(questRes.data);
    } catch (err) {
      console.error('Failed to update application status:', err);
      // Revert or show error
    }
  };

  const handleRemoveMember = async (appId) => {
    if (!window.confirm("Are you sure you want to remove this member from the squad?")) return;
    try {
      await appsApi.remove(appId);
      // Refresh data
      const appsRes = await questsApi.getApplications(id);
      setApplications(appsRes.data);
      const questRes = await questsApi.getById(id);
      setQuest(questRes.data);
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-obsidian">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,255,255,0.2)]" />
      </div>
    );
  }

  if (error || !quest) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-obsidian text-center p-6">
        <AlertCircle size={48} className="text-alert mb-4" />
        <h2 className="text-2xl font-rajdhani font-bold text-white uppercase tracking-tight">{error || 'Mission Not Found'}</h2>
        <button onClick={() => navigate('/discover')} className="mt-6 text-primary font-bold uppercase tracking-widest hover:underline">
          Return to Base
        </button>
      </div>
    );
  }

  const pendingApps = applications.filter(a => a.status === 'pending');
  const acceptedApps = applications.filter(a => a.status === 'accepted');

  return (
    <div className="flex-1 bg-obsidian overflow-y-auto pb-32">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-surface/50 backdrop-blur-md sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-obsidian/60 border border-white/10 flex items-center justify-center text-white hover:text-primary transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-rajdhani font-bold text-white uppercase tracking-wider">Squad Management</h1>
          <p className="text-xs text-primary font-bold uppercase tracking-[0.2em]">{quest.title}</p>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10 max-w-2xl mx-auto">
        {/* Squad Status */}
        <div className="bg-surface rounded-2xl border border-white/5 p-6 flex items-center justify-between shadow-xl shadow-black/20">
           <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Current Strength</div>
              <div className="flex items-end gap-2">
                 <span className="text-4xl font-rajdhani font-black text-white">{quest.filled_slots}</span>
                 <span className="text-xl font-rajdhani font-bold text-slate-600 mb-1">/ {quest.total_slots}</span>
              </div>
           </div>
           <div className={`px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest ${
              quest.filled_slots >= quest.total_slots 
              ? 'bg-primary/10 border-primary/30 text-primary animate-pulse' 
              : 'bg-secondary/10 border-secondary/30 text-secondary'
           }`}>
              {quest.filled_slots >= quest.total_slots ? 'Squad Full' : 'Recruiting'}
           </div>
        </div>

        {/* Applicants Section */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-primary font-rajdhani font-bold text-xl uppercase tracking-wider flex items-center gap-2">
                 Applicants <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{pendingApps.length}</span>
              </h3>
           </div>
           
           <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {pendingApps.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center text-slate-600 text-sm italic"
                  >
                    No incoming signals for recruitment.
                  </motion.div>
                ) : (
                  pendingApps.map(app => (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 bg-surface rounded-xl border border-white/5 flex items-center gap-4 group"
                    >
                      <img 
                        src={app.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.username}`} 
                        className="w-12 h-12 rounded-full border border-white/10"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                         <div className="text-white font-bold truncate">{app.username}</div>
                         <div className="flex items-center gap-2">
                            <Trophy size={12} className="text-secondary" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{app.skill_level}</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button 
                            onClick={() => handleUpdateStatus(app.id, 'rejected')}
                            className="w-10 h-10 rounded-lg bg-alert/10 text-alert border border-alert/20 flex items-center justify-center hover:bg-alert hover:text-obsidian transition-all"
                            title="Reject"
                         >
                            <X size={20} />
                         </button>
                         <button 
                            onClick={() => handleUpdateStatus(app.id, 'accepted')}
                            className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-obsidian transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                            title="Accept"
                         >
                            <Check size={20} />
                         </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
           </div>
        </section>

        {/* Current Squad Section */}
        <section className="space-y-4">
           <h3 className="text-secondary font-rajdhani font-bold text-xl uppercase tracking-wider flex items-center gap-2">
              Squad Members <span className="bg-secondary/20 text-secondary text-xs px-2 py-0.5 rounded-full">{acceptedApps.length + 1}</span>
           </h3>
           
           <div className="grid gap-3">
              {/* Leader always at top */}
              <div className="p-4 bg-surface/30 rounded-xl border border-primary/20 flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                      className="w-10 h-10 rounded-full border border-primary/50"
                      alt=""
                    />
                    <div className="absolute -top-1 -right-1">
                       <Zap size={14} className="text-primary fill-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                     <div className="text-white font-bold">{user.username}</div>
                     <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Mission Lead</div>
                  </div>
              </div>

              {acceptedApps.map(app => (
                <div key={app.id} className="p-4 bg-surface/30 rounded-xl border border-white/5 flex items-center gap-4">
                    <img 
                      src={app.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.username}`} 
                      className="w-10 h-10 rounded-full border border-white/10"
                      alt=""
                    />
                    <div className="flex-1">
                       <div className="text-white font-bold">{app.username}</div>
                       <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{app.skill_level} Member</div>
                    </div>
                    <button 
                       onClick={() => handleRemoveMember(app.id)}
                       className="text-slate-600 hover:text-alert transition-colors"
                    >
                       <UserX size={18} />
                    </button>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default ManageSquad;
