import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserX,
  X,
  Check,
  ChevronLeft,
  Zap,
  Trophy,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { quests as questsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VerifiedBadge from '../components/VerifiedBadge';

const ManageSquad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quest, setQuest] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSquadData();
  }, [id]);

  const fetchSquadData = async () => {
    try {
      const [qResponse, aResponse] = await Promise.all([
        questsApi.getById(id),
        questsApi.getApplications(id)
      ]);
      setQuest(qResponse.data);
      setApplications(aResponse.data);
    } catch (err) {
      console.error('Failed to fetch squad data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      await questsApi.updateApplicationStatus(appId, status);
      fetchSquadData(); // Refresh list
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleRemoveMember = async (appId) => {
    if (window.confirm('Remove this member from the squad?')) {
      handleUpdateStatus(appId, 'rejected');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-surface border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,255,255,0.2)]" />
      </div>
    );
  }

  if (!quest) return null;

  const pendingApps = applications.filter(app => app.status === 'pending');
  const acceptedApps = applications.filter(app => app.status === 'accepted');

  return (
    <div className="flex-1 bg-background overflow-y-auto pb-32">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 p-6">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-text-low hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 min-w-0">
             <h2 className="text-xl font-rajdhani font-bold text-white uppercase tracking-tight truncate">
               Squad Management
             </h2>
             <p className="text-[10px] text-primary font-black uppercase tracking-widest truncate">{quest.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-10">
        {/* Applicants Section */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-primary font-rajdhani font-bold text-xl uppercase tracking-wider flex items-center gap-2">
                 Incoming Signals
              </h3>
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingApps.length} PENDING
              </span>
           </div>
           
           <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {pendingApps.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-10 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-surface-light/5 flex items-center justify-center text-text-low/20">
                      <ShieldAlert size={32} />
                    </div>
                    <div className="text-sm text-text-low font-medium">
                      No incoming recruitment signals detected.<br />
                      Keep your radar active.
                    </div>
                  </motion.div>
                ) : (
                  pendingApps.map(app => (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 bg-surface rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-primary/30 transition-all"
                    >
                      <img
                        src={app.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.username}`}
                        className="w-12 h-12 rounded-full border border-white/10"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                           <span className="text-white font-bold truncate">{app.username}</span>
                           {app.is_verified && <VerifiedBadge size={14} />}
                         </div>
                         <div className="flex items-center gap-2 mt-0.5">
                            <Trophy size={12} className="text-secondary" />
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{app.skill_level}</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button
                            onClick={() => handleUpdateStatus(app.id, 'rejected')}
                            className="w-10 h-10 rounded-xl bg-alert/5 text-alert border border-alert/10 flex items-center justify-center hover:bg-alert hover:text-white transition-all"
                            title="Reject"
                         >
                            <X size={20} />
                         </button>
                         <button
                            onClick={() => handleUpdateStatus(app.id, 'accepted')}
                            className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all shadow-[0_0_15px_rgba(0,255,255,0.1)]"
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
              Active Squad <span className="text-slate-500 text-sm font-inter">({acceptedApps.length + 1}/{quest.total_slots})</span>
           </h3>
           <div className="grid gap-3">
              {/* Leader always at top */}
              <div className="p-4 bg-surface-light/5 rounded-2xl border border-primary/40 flex items-center gap-4 relative overflow-hidden group shadow-[0_0_20px_rgba(0,245,255,0.05)]">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={64} className="text-primary fill-primary" />
                  </div>
                  <div className="relative">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      className="w-12 h-12 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                      alt=""
                    />
                    <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full text-background animate-pulse">
                       <Zap size={10} fill="currentColor" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                       <span className="text-white font-bold">{user.username}</span>
                       <VerifiedBadge size={14} />
                     </div>
                     <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-0.5">Mission Lead</div>
                  </div>
              </div>

              {acceptedApps.map(app => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={app.id} 
                  className="p-4 bg-surface/30 rounded-2xl border border-white/5 flex items-center gap-4 group"
                >
                    <img
                      src={app.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.username}`}
                      className="w-12 h-12 rounded-full border border-white/10"
                      alt=""
                    />
                    <div className="flex-1">
                       <div className="flex items-center gap-2">
                         <span className="text-white font-bold">{app.username}</span>
                         {app.is_verified && <VerifiedBadge size={14} />}
                       </div>
                       <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{app.skill_level} Member</div>
                    </div>
                    <button
                       onClick={() => handleRemoveMember(app.id)}
                       className="w-10 h-10 rounded-xl hover:bg-alert/10 text-slate-600 hover:text-alert transition-all flex items-center justify-center"
                       title="Remove Member"
                    >
                       <UserX size={18} />
                    </button>
                </motion.div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: Math.max(0, quest.total_slots - (acceptedApps.length + 1)) }).map((_, i) => (
                <div key={`empty-${i}`} className="p-4 border border-dashed border-white/5 rounded-2xl flex items-center gap-4 opacity-30">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/20">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-white/10 rounded-full" />
                    <div className="h-2 w-16 bg-white/5 rounded-full mt-2" />
                  </div>
                </div>
              ))}
           </div>
        </section>
        
        {acceptedApps.length + 1 >= quest.total_slots && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-primary/10 border border-primary/20 rounded-3xl text-center space-y-4"
          >
             <h4 className="text-primary font-rajdhani font-black text-2xl uppercase tracking-tighter italic">Squad Combat Ready</h4>
             <p className="text-xs text-primary/70 font-medium">All positions have been filled. Launch the mission when ready.</p>
             <button className="w-full py-4 bg-primary text-background font-black rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.3)] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                Initiate Mission
             </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManageSquad;
