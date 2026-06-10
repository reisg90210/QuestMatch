import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Gamepad2, 
  Trophy, 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Zap
} from 'lucide-react';
import { quests as questsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VerifiedBadge from '../components/VerifiedBadge';

const QuestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const response = await questsApi.getById(id);
        setQuest(response.data);
      } catch (err) {
        console.error('Failed to fetch quest:', err);
        setError('Mission data could not be retrieved.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuest();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError(null);
    try {
      await questsApi.apply(id);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to transmit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-obsidian">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,255,255,0.2)]" />
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-obsidian text-center p-6">
        <AlertCircle size={48} className="text-alert mb-4" />
        <h2 className="text-2xl font-rajdhani font-bold text-white uppercase tracking-tight">Mission Not Found</h2>
        <button 
          onClick={() => navigate('/discover')}
          className="mt-6 text-primary font-bold uppercase tracking-widest hover:underline"
        >
          Return to Radar
        </button>
      </div>
    );
  }

  const isCreator = quest.creator_id === user.id;

  return (
    <div className="flex-1 bg-obsidian overflow-y-auto pb-32">
      {/* Header Banner */}
      <div className="relative h-64 w-full">
        <div className="absolute inset-0 bg-primary/10 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-obsidian/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-primary transition-all z-10"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
           <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-black uppercase rounded tracking-widest shadow-[0_0_10px_rgba(123,44,191,0.5)]">
                  {quest.quest_type}
                </span>
              </div>
              <h1 className="text-4xl font-rajdhani font-black text-white uppercase tracking-tighter leading-none">
                {quest.title}
              </h1>
           </div>
        </div>
      </div>

      <div className="px-6 space-y-8 max-w-2xl mx-auto mt-6">
        {/* Creator Info */}
        <div className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-white/5">
           <div className="relative">
              <img 
                src={quest.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${quest.creator_name}`} 
                className="w-12 h-12 rounded-full border border-primary/30"
                alt=""
              />
              {quest.creator_is_verified && (
                <div className="absolute -bottom-1 -right-1">
                  <VerifiedBadge size={16} />
                </div>
              )}
           </div>
           <div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Squad Leader</div>
              <div className="text-white font-rajdhani font-bold text-lg">{quest.creator_name}</div>
           </div>
           {isCreator && (
             <button 
                onClick={() => navigate(`/manage-squad/${quest.id}`)}
                className="ml-auto px-4 py-2 bg-secondary/20 border border-secondary/40 text-secondary text-xs font-bold rounded-lg hover:bg-secondary/30 transition-all uppercase tracking-widest"
             >
                Manage Squad
             </button>
           )}
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-surface/50 p-4 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Gamepad2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Platform/Game</span>
              </div>
              <div className="text-white font-bold">{quest.game_id}</div>
           </div>
           <div className="bg-surface/50 p-4 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-secondary">
                <Trophy size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Rank Required</span>
              </div>
              <div className="text-white font-bold">{quest.requirements?.skill_level || 'All Levels'}</div>
           </div>
           <div className="bg-surface/50 p-4 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Users size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Squad Size</span>
              </div>
              <div className="text-white font-bold">{quest.filled_slots} / {quest.total_slots} Slots</div>
           </div>
           <div className="bg-surface/50 p-4 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-secondary">
                <Clock size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Mission Start</span>
              </div>
              <div className="text-white font-bold">{quest.start_time}</div>
           </div>
        </div>

        {/* Objective Section */}
        <div className="space-y-3">
          <h3 className="text-primary font-rajdhani font-bold text-xl uppercase tracking-wider flex items-center gap-2">
            Mission Objective
          </h3>
          <div className="p-5 bg-surface rounded-2xl border border-white/5 text-slate-300 leading-relaxed italic">
            "{quest.description}"
          </div>
        </div>

        {/* Requirements Checklist */}
        {quest.requirements && (
          <div className="space-y-3">
            <h3 className="text-secondary font-rajdhani font-bold text-xl uppercase tracking-wider">
              Tactical Specs
            </h3>
            <div className="grid gap-3">
               <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Voice comms required for coordination</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>High-speed connection recommended</span>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {!isCreator && (
        <div className="fixed bottom-24 left-0 right-0 p-6 bg-gradient-to-t from-obsidian via-obsidian to-transparent">
          <div className="max-w-2xl mx-auto">
            {success ? (
              <div className="w-full py-4 bg-green-500/10 border border-green-500/50 text-green-500 rounded-xl flex items-center justify-center gap-3 font-bold">
                <CheckCircle2 size={20} />
                APPLICATION TRANSMITTED
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-alert/10 border border-alert/20 text-alert text-xs font-bold rounded-lg text-center">
                    {error}
                  </div>
                )}
                <button 
                  onClick={handleApply}
                  disabled={applying || quest.filled_slots >= quest.total_slots}
                  className="w-full py-5 bg-primary text-obsidian font-black rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? 'Transmitting...' : quest.filled_slots >= quest.total_slots ? 'MISSION FULL' : 'APPLY TO SQUAD'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestDetails;
