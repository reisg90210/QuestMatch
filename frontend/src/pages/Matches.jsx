import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Sliders,
  Send,
  ChevronLeft,
  MoreVertical,
  Phone,
  Video,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { matches as matchesApi, messages as messagesApi } from '../services/api';
import VerifiedBadge from '../components/VerifiedBadge';
import FilterSidebar from '../components/FilterSidebar';
import radarImg from '../assets/empty_state_radar.png';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    game: 'all',
    rank: 'all',
    playstyle: 'all'
  });

  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.id);
    }
  }, [selectedMatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMatches = async () => {
    try {
      const response = await matchesApi.list();
      setMatches(response.data);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId) => {
    try {
      const response = await messagesApi.list(matchId);
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      const response = await messagesApi.send(selectedMatch.id, newMessage);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (selectedMatch) {
    return (
      <div className="flex-1 bg-background flex flex-col min-h-screen pb-20 md:pb-0 font-inter">
        {/* Chat Header */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedMatch(null)} className="text-text-low hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div className="relative">
               <img
                src={selectedMatch.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMatch.username}`}
                className="w-10 h-10 rounded-full border border-primary/30"
                alt=""
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-sm">{selectedMatch.username}</span>
                {selectedMatch.is_verified && <VerifiedBadge size={12} />}
              </div>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Link</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-text-low">
             <Phone size={18} className="cursor-not-allowed opacity-30" />
             <Video size={18} className="cursor-not-allowed opacity-30" />
             <MoreVertical size={18} className="cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center space-y-2">
             <ShieldCheck size={48} className="text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Channel Established</p>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  msg.sender_id === user.id
                    ? 'bg-primary text-background font-medium rounded-tr-none shadow-lg shadow-primary/10'
                    : 'bg-surface border border-white/5 text-white rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-t border-white/5 sticky bottom-20 md:bottom-0">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              className="flex-1 px-5 py-4 bg-surface border border-white/5 rounded-2xl text-white placeholder:text-text-low focus:outline-none focus:border-primary/50 transition-all text-sm shadow-inner"
              placeholder="Send a transmission..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-background w-14 h-14 rounded-2xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background overflow-y-auto pb-40 font-inter">
      <div className="p-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-lg z-10">
        <h1 className="text-4xl font-rajdhani font-bold text-white uppercase tracking-tight">
          Your <span className="text-primary">Squad</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center text-text-low hover:text-primary transition-all cursor-pointer">
            <Search size={20} />
          </div>
          <div
            onClick={() => setIsFilterOpen(true)}
            className="w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center text-text-low hover:text-primary transition-all cursor-pointer"
          >
            <Sliders size={20} />
          </div>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-12 h-12 border-4 border-surface border-t-primary rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <div className="py-12 text-center">
            <div className="relative w-64 h-64 mx-auto mb-6">
               <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full animate-pulse" />
               <img 
                 src={radarImg} 
                 alt="No squads" 
                 className="relative z-10 w-full h-full object-contain opacity-80" 
               />
            </div>
            <h2 className="text-2xl font-rajdhani font-bold text-white uppercase tracking-tight">Radar Clear</h2>
            <p className="text-text-low font-medium mt-2 max-w-xs mx-auto text-sm">No tactical matches yet. Head back to Discovery to find your next squad.</p>
            <button 
              onClick={() => navigate('/discover')}
              className="mt-8 px-8 py-3 bg-primary/10 border border-primary/20 text-primary font-bold rounded-xl uppercase tracking-widest text-xs hover:bg-primary hover:text-background transition-all"
            >
              Start Discovery
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedMatch(match)}
                className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group active:scale-[0.98] shadow-lg shadow-black/20"
              >
                <div className="relative">
                  <img
                    src={match.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.username}`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-primary/50 transition-all"
                    alt={match.username}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-white font-rajdhani font-bold uppercase tracking-wide text-xl truncate">{match.username}</h3>
                    {match.is_verified && <VerifiedBadge size={14} />}
                  </div>
                  <p className="text-text-low text-xs mt-0.5 font-medium truncate italic">
                    Ready for mission deployment...
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                   <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
                   <span className="text-[10px] text-text-low/30 font-bold uppercase tracking-widest">12m</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        isPremium={user?.is_premium}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default Matches;
