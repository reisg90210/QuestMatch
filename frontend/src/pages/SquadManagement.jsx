import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, X, Shield, Trophy, Star, ChevronRight, UserMinus } from 'lucide-react';

const INITIAL_SQUAD = [
  { id: 'u1', username: 'ShadowSlayer', rank: 'Gold II', level: 42, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowSlayer' },
  { id: 'u3', username: 'HealerMain', rank: 'Platinum I', level: 38, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HealerMain' },
];

const INITIAL_APPLICANTS = [
  { id: 'a1', username: 'NoobPwn3r', rank: 'Silver III', level: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NoobPwn3r' },
  { id: 'a2', username: 'CyberPunk', rank: 'Diamond IV', level: 89, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberPunk' },
];

const SquadManagement = () => {
  const [squad, setSquad] = useState(INITIAL_SQUAD);
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);

  const acceptApplicant = (applicant) => {
    setApplicants(prev => prev.filter(a => a.id !== applicant.id));
    setSquad(prev => [...prev, applicant]);
  };

  const rejectApplicant = (id) => {
    setApplicants(prev => prev.filter(a => a.id !== id));
  };

  const kickMember = (id) => {
    setSquad(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="flex-1 bg-background min-h-screen pb-28 font-inter">
      <div className="p-6 sticky top-0 bg-background/80 backdrop-blur-lg z-10 border-b border-white/5">
        <h1 className="text-3xl font-rajdhani font-bold text-text-high uppercase tracking-tight">
          Squad <span className="text-primary">Management</span>
        </h1>
        <p className="text-text-low text-xs mt-1 font-medium uppercase tracking-widest">
          Quest: <span className="text-secondary">Elite Rank Push</span>
        </p>
      </div>

      <div className="p-4 space-y-8 max-w-lg mx-auto">
        {/* Applicants Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani flex items-center gap-2">
              <Star size={14} className="text-primary" /> New Applicants
            </h3>
            <span className="bg-primary text-background text-[10px] font-black px-2 py-0.5 rounded-full">
              {applicants.length}
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {applicants.length === 0 ? (
                <div className="py-8 text-center bg-surface/20 rounded-2xl border border-dashed border-white/10">
                   <p className="text-text-low/40 text-xs font-bold uppercase tracking-widest">No new signals</p>
                </div>
              ) : (
                applicants.map((app) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-surface p-4 rounded-2xl border border-white/5 flex items-center gap-4 shadow-xl"
                  >
                    <img src={app.avatar} className="w-12 h-12 rounded-full border border-primary/20" alt="" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-text-high font-bold truncate">{app.username}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] text-secondary font-black uppercase tracking-tighter">{app.rank}</span>
                         <span className="text-[10px] text-text-low/50 font-bold uppercase">LVL {app.level}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => rejectApplicant(app.id)}
                        className="w-12 h-12 rounded-xl bg-alert/10 text-alert flex items-center justify-center hover:bg-alert hover:text-white transition-all border border-alert/20"
                       >
                         <X size={20} />
                       </button>
                       <button 
                        onClick={() => acceptApplicant(app)}
                        className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all border border-primary/20"
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
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani flex items-center gap-2">
            <Users size={14} className="text-secondary" /> Active Squad ({squad.length}/4)
          </h3>

          <div className="bg-surface/50 rounded-[2rem] p-2 border border-white/5">
            <div className="space-y-2">
              {/* Creator (Self) */}
              <div className="bg-background/50 p-4 rounded-[1.5rem] flex items-center gap-4 border border-white/5">
                <div className="relative">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=me" className="w-12 h-12 rounded-full border-2 border-primary shadow-[0_0_15px_rgba(0,245,255,0.3)]" alt="" />
                  <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full text-background">
                    <Shield size={10} strokeWidth={3} />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-text-high font-bold flex items-center gap-2">
                    You <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-tighter">Leader</span>
                  </h4>
                  <p className="text-[10px] text-text-low/50 font-bold uppercase tracking-widest mt-0.5">Diamond II</p>
                </div>
              </div>

              {squad.map((member) => (
                <div key={member.id} className="p-4 rounded-[1.5rem] flex items-center gap-4 hover:bg-white/5 transition-colors group">
                  <img src={member.avatar} className="w-12 h-12 rounded-full border border-white/10" alt="" />
                  <div className="flex-1">
                    <h4 className="text-text-high font-medium">{member.username}</h4>
                    <p className="text-[10px] text-text-low/50 font-bold uppercase tracking-widest mt-0.5">{member.rank}</p>
                  </div>
                  <button 
                    onClick={() => kickMember(member.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-text-low hover:text-alert transition-all"
                    title="Kick Member"
                  >
                    <UserMinus size={18} />
                  </button>
                  <ChevronRight size={16} className="text-text-low/20" />
                </div>
              ))}

              {/* Empty Slots */}
              {Array.from({ length: 3 - squad.length }).map((_, i) => (
                <div key={i} className="p-4 rounded-[1.5rem] border border-dashed border-white/5 flex items-center gap-4 opacity-30">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-dashed border-white/20">
                    <Plus size={20} className="text-text-low" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-white/10 rounded-full" />
                    <div className="h-2 w-16 bg-white/5 rounded-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="p-6">
        <button className="w-full py-4 bg-primary text-background font-black rounded-2xl shadow-[0_0_30px_rgba(0,245,255,0.3)] uppercase tracking-[0.2em] hover:brightness-110 transition-all">
          Launch Mission
        </button>
      </div>
    </div>
  );
};

export default SquadManagement;
