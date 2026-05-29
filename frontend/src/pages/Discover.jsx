import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Info, RefreshCw } from 'lucide-react';
import { discovery, swipes } from '../services/api';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await discovery.getPotentialMatches();
      setUsers(response.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= users.length) return;
    
    const swipedUser = users[currentIndex];
    setSwipeDirection(direction === 'like' ? 'right' : 'left');
    
    try {
      const response = await swipes.submitSwipe(swipedUser.id, direction);
      if (response.data.match) {
        setMatch(swipedUser);
      }
    } catch (err) {
      console.error('Failed to submit swipe', err);
    }

    // Small delay to let animation finish if triggered by button
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 200);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-12 h-12 border-4 border-[#2a2a3e] border-t-[#7c3aed] rounded-full animate-spin" />
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0f]">
        <img src="/assets/empty-state.svg" className="w-64 h-64 mb-6 opacity-50" alt="Empty" />
        <h2 className="text-2xl font-bold text-white mb-2">No more players!</h2>
        <p className="text-[#94a3b8] mb-8">Check back later for more gamers in your area.</p>
        <button 
          onClick={fetchUsers}
          className="flex items-center gap-2 bg-[#1e1e32] border border-[#2a2a3e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2a2a3e] transition"
        >
          <RefreshCw size={20} /> Refresh
        </button>
      </div>
    );
  }

  const currentUser = users[currentIndex];
  const avatarUrl = currentUser.avatar_url || `/assets/avatar-gamer-${(currentIndex % 4) + 1}.jpg`;

  return (
    <div className="flex-1 flex flex-col p-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Match Overlay */}
      <AnimatePresence>
        {match && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] blur-3xl opacity-40 animate-pulse" />
                </div>
                <div className="relative flex items-center gap-6 justify-center">
                  <div className="w-28 h-28 rounded-full border-4 border-[#ec4899] overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                    <img src="/assets/avatar-gamer-1.jpg" className="w-full h-full object-cover" alt="Me" />
                  </div>
                  <Heart className="w-12 h-12 text-[#ec4899] animate-bounce" fill="#ec4899" />
                  <div className="w-28 h-28 rounded-full border-4 border-[#7c3aed] overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                    <img src={currentUser.avatar_url || `/assets/avatar-gamer-2.jpg`} className="w-full h-full object-cover" alt="Match" />
                  </div>
                </div>
              </motion.div>

              <h2 className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent italic">
                IT'S A MATCH!
              </h2>
              <p className="text-[#94a3b8] text-lg mb-10">You and {match.username} liked each other</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  className="w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-full text-white font-bold text-xl shadow-lg hover:opacity-90 transition"
                  onClick={() => setMatch(null)}
                >
                  Send Message
                </button>
                <button 
                  onClick={() => setMatch(null)}
                  className="w-full py-4 bg-transparent border border-[#2a2a3e] text-white rounded-full font-bold text-lg hover:bg-[#1e1e32] transition"
                >
                  Keep Swiping
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Card Area */}
      <div className="flex-1 relative max-w-sm w-full mx-auto mt-2 mb-24">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentUser.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleSwipe('like');
              else if (info.offset.x < -100) handleSwipe('dislike');
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={(custom) => ({
              x: swipeDirection === 'right' ? 500 : -500,
              opacity: 0,
              rotate: swipeDirection === 'right' ? 20 : -20,
              transition: { duration: 0.3 }
            })}
            className="absolute inset-0 bg-[#1a1a2e] rounded-[2rem] shadow-2xl overflow-hidden border border-[#2a2a3e] flex flex-col cursor-grab active:cursor-grabbing"
          >
            <div className="relative flex-1">
              <img 
                src={avatarUrl} 
                alt={currentUser.username}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-90" />
              
              {/* Platform Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {currentUser.platforms?.map(platform => (
                  <span key={platform} className="px-3 py-1 bg-[#14141f]/80 backdrop-blur-md border border-[#2a2a3e] rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {platform}
                  </span>
                ))}
              </div>

              {/* Skill Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${
                  currentUser.skill_level === 'Pro' ? 'bg-[#10b981] text-black' :
                  currentUser.skill_level === 'Competitive' ? 'bg-[#7c3aed] text-white' :
                  'bg-[#64748b] text-white'
                }`}>
                  {currentUser.skill_level}
                </span>
              </div>

              {/* User Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  {currentUser.username}
                  <span className="text-xl font-normal opacity-60">24</span>
                </h2>
                <p className="text-[#94a3b8] text-sm mt-2 line-clamp-3 leading-relaxed">
                  {currentUser.bio || "No bio yet. Looking for a duo partner to climb the ranks!"}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentUser.games?.map(game => (
                    <span key={game} className="px-3 py-1 bg-[#7c3aed]/20 border border-[#7c3aed]/30 rounded-full text-[10px] font-bold text-[#c084fc] uppercase tracking-tighter">
                      {game}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-28 left-0 right-0 flex justify-center items-center gap-6 z-40">
        <button 
          onClick={() => handleSwipe('dislike')}
          className="w-16 h-16 rounded-full bg-[#14141f] border-2 border-[#ef4444]/30 flex items-center justify-center shadow-xl text-[#ef4444] hover:bg-[#ef4444]/10 hover:scale-110 active:scale-95 transition-all"
        >
          <X size={32} strokeWidth={3} />
        </button>
        
        <button 
          className="w-12 h-12 rounded-full bg-[#14141f] border-2 border-[#06b6d4]/30 flex items-center justify-center shadow-xl text-[#06b6d4] hover:bg-[#06b6d4]/10 hover:scale-110 active:scale-95 transition-all"
        >
          <Star size={24} fill="currentColor" />
        </button>

        <button 
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 rounded-full bg-[#14141f] border-2 border-[#ec4899]/30 flex items-center justify-center shadow-xl text-[#ec4899] hover:bg-[#ec4899]/10 hover:scale-110 active:scale-95 transition-all"
        >
          <Heart size={32} fill="currentColor" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default Discover;
