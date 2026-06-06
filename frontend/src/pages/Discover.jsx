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
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-surface border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (currentIndex >= users.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background font-inter">
        <div className="w-64 h-64 mb-8 bg-surface/30 rounded-full flex items-center justify-center border border-primary/10">
           <RefreshCw size={80} className="text-primary/20 animate-spin-slow" />
        </div>
        <h2 className="text-4xl font-rajdhani font-bold text-text-high mb-2 uppercase tracking-tight">No more <span className="text-primary">Quests</span>!</h2>
        <p className="text-text-low mb-10 max-w-xs">Check back later for more collaborators in the sector.</p>
        <button 
          onClick={fetchUsers}
          className="flex items-center gap-3 bg-primary text-background px-10 py-4 rounded-xl font-rajdhani font-bold text-xl hover:brightness-110 transition shadow-[0_0_20px_rgba(0,245,255,0.2)]"
        >
          <RefreshCw size={24} /> REFRESH SCAN
        </button>
      </div>
    );
  }

  const currentUser = users[currentIndex];
  const avatarUrl = currentUser.avatar_url || `/assets/avatar-gamer-${(currentIndex % 4) + 1}.jpg`;

  return (
    <div className="flex-1 flex flex-col p-4 relative overflow-hidden bg-background font-inter">
      {/* Match Overlay */}
      <AnimatePresence>
        {match && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="text-center w-full max-w-sm">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative mb-12"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
                </div>
                <div className="relative flex items-center gap-4 justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-secondary overflow-hidden shadow-[0_0_30px_rgba(123,44,191,0.4)]">
                    <img src="/assets/avatar-gamer-1.jpg" className="w-full h-full object-cover" alt="Me" />
                  </div>
                  <div className="bg-primary/20 p-4 rounded-full border border-primary/50 animate-bounce">
                    <Heart className="w-8 h-8 text-primary" fill="currentColor" />
                  </div>
                  <div className="w-24 h-24 rounded-full border-4 border-primary overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.4)]">
                    <img src={currentUser.avatar_url || `/assets/avatar-gamer-2.jpg`} className="w-full h-full object-cover" alt="Match" />
                  </div>
                </div>
              </motion.div>

              <h2 className="text-5xl font-rajdhani font-bold text-primary mb-2 uppercase tracking-tighter shadow-primary/20">
                SQUAD LINKED!
              </h2>
              <p className="text-text-low text-lg mb-10">You and {match.username} are compatible.</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  className="w-full py-5 bg-primary text-background rounded-2xl font-rajdhani font-bold text-xl shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:brightness-110 transition"
                  onClick={() => setMatch(null)}
                >
                  START TRANSMISSION
                </button>
                <button 
                  onClick={() => setMatch(null)}
                  className="w-full py-5 bg-surface/50 border border-background text-text-high rounded-2xl font-rajdhani font-bold text-xl hover:bg-surface transition"
                >
                  CONTINUE SEARCH
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Card Area */}
      <div className="flex-1 relative max-w-sm w-full mx-auto mt-4 mb-28">
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
            className="absolute inset-0 bg-surface rounded-[2.5rem] shadow-2xl overflow-hidden border border-background flex flex-col cursor-grab active:cursor-grabbing shadow-black/40"
          >
            <div className="relative flex-1">
              <img 
                src={avatarUrl} 
                alt={currentUser.username}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
              
              {/* Platform Badges */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                {currentUser.platforms?.map(platform => (
                  <span key={platform} className="px-3 py-1 bg-surface/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-text-high uppercase tracking-widest">
                    {platform}
                  </span>
                ))}
              </div>

              {/* Skill Badge */}
              <div className="absolute top-6 right-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg border-2 border-background ${
                  currentUser.skill_level === 'Pro' ? 'bg-primary text-background' :
                  currentUser.skill_level === 'Competitive' ? 'bg-secondary text-text-high' :
                  'bg-background text-text-low'
                }`}>
                  {currentUser.skill_level}
                </span>
              </div>

              {/* User Info */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h2 className="text-4xl font-rajdhani font-bold text-text-high flex items-center gap-3 uppercase tracking-tight">
                  {currentUser.username}
                  <span className="text-xl font-normal text-primary">LVL 24</span>
                </h2>
                <p className="text-text-low text-sm mt-3 line-clamp-3 leading-relaxed">
                  {currentUser.bio || "No bio yet. Looking for a duo partner to climb the ranks!"}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {currentUser.games?.map(game => (
                    <span key={game} className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-bold text-primary uppercase tracking-wider">
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
      <div className="fixed bottom-32 left-0 right-0 flex justify-center items-center gap-8 z-40">
        <button 
          onClick={() => handleSwipe('dislike')}
          className="w-16 h-16 rounded-full bg-surface border-2 border-alert/20 flex items-center justify-center shadow-xl text-alert hover:bg-alert/10 hover:scale-110 active:scale-95 transition-all shadow-black/40"
        >
          <X size={32} strokeWidth={3} />
        </button>
        
        <button 
          className="w-12 h-12 rounded-full bg-surface border-2 border-secondary/20 flex items-center justify-center shadow-xl text-secondary hover:bg-secondary/10 hover:scale-110 active:scale-95 transition-all shadow-black/40"
        >
          <Star size={24} fill="currentColor" />
        </button>

        <button 
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 rounded-full bg-surface border-2 border-primary/20 flex items-center justify-center shadow-xl text-primary hover:bg-primary/10 hover:scale-110 active:scale-95 transition-all shadow-black/40 shadow-primary/10"
        >
          <Heart size={32} fill="currentColor" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default Discover;
