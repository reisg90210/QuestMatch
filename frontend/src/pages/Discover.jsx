import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Star, Users, Gamepad2, Clock, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Discover = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showMatchOverlay, setShowMatchOverlay] = useState(false);
  
  const x = useMotionValue(0);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, -20], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, questsRes] = await Promise.all([
          api.get('/users'),
          api.get('/api/quests')
        ]);
        
        const others = usersRes.data.filter(u => u.id !== user.id);
        const activeQuests = questsRes.data.filter(q => q.creator_id !== user.id);
        
        // Interleave users and quests
        const combined = [];
        const maxLen = Math.max(others.length, activeQuests.length);
        for (let i = 0; i < maxLen; i++) {
          if (others[i]) combined.push({ ...others[i], itemType: 'user' });
          if (activeQuests[i]) combined.push({ ...activeQuests[i], itemType: 'quest' });
        }
        
        setItems(combined);
      } catch (err) {
        console.error('Failed to fetch discovery data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const handleSwipe = async (direction) => {
    if (currentIndex >= items.length) return;
    
    const currentItem = items[currentIndex];
    setSwipeDirection(direction === 'like' ? 'right' : 'left');

    setTimeout(async () => {
      if (direction === 'like') {
        if (currentItem.itemType === 'user') {
          try {
            const response = await api.post('/swipes', {
              swiped_id: currentItem.id,
              direction: 'like'
            });
            if (response.data.match) {
              setShowMatchOverlay(true);
            }
          } catch (err) {
            console.error('Swipe failed:', err);
          }
        } else {
          // It's a quest - "Joining" the quest
          try {
            // For now, just a simple notification or placeholder for join logic
            console.log('Requested to join quest:', currentItem.id);
          } catch (err) {
            console.error('Failed to join quest:', err);
          }
        }
      }
      
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      x.set(0);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,245,255,0.2)]" />
        <p className="mt-6 text-primary font-rajdhani font-bold text-xl animate-pulse tracking-[0.2em] uppercase">
          Scanning Network...
        </p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  if (!currentItem) {
    return (
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center bg-background px-8 text-center">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-2 border-slate-800 mb-6">
          <Users className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-2xl font-rajdhani font-bold text-white uppercase tracking-tight">Zero Signals Detected</h2>
        <p className="text-slate-400 mt-2 max-w-xs">
          You've explored the entire sector. Broaden your search parameters or check back later.
        </p>
        <button 
          onClick={() => setCurrentIndex(0)}
          className="mt-8 px-8 py-3 bg-primary text-background font-bold rounded-xl hover:bg-cyan-400 transition-all uppercase tracking-wider"
        >
          RESET RADAR
        </button>
      </div>
    );
  }

  const isQuest = currentItem.itemType === 'quest';

  return (
    <div className="flex-1 flex flex-col items-center bg-background overflow-hidden pt-4 relative">
      {/* Match Overlay */}
      <AnimatePresence>
        {showMatchOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex flex-center items-center justify-center p-8"
          >
            <div className="text-center space-y-8 max-w-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl font-black italic text-primary font-rajdhani tracking-tighter"
              >
                IT IS A MATCH!
              </motion.div>
              <div className="flex justify-center -space-x-4">
                <div className="w-32 h-32 rounded-full border-4 border-primary overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                   <img src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=me'} alt="" />
                </div>
                <div className="w-32 h-32 rounded-full border-4 border-secondary overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.3)]">
                   <img src={currentItem.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentItem.username}`} alt="" />
                </div>
              </div>
              <p className="text-white text-xl font-medium">You and <span className="text-primary">{currentItem.username}</span> have connected.</p>
              <div className="pt-4 space-y-4">
                <button 
                  onClick={() => setShowMatchOverlay(false)}
                  className="w-full py-4 bg-primary text-background font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                >
                  SEND MISSION COMMAND
                </button>
                <button 
                  onClick={() => setShowMatchOverlay(false)}
                  className="w-full py-4 border border-white/20 text-white font-medium rounded-xl"
                >
                  KEEP SCANNING
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Card Area */}
      <div className="flex-1 relative w-[90%] max-w-[400px] mx-auto mt-4 mb-28">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={isQuest ? `quest-${currentItem.id}` : `user-${currentItem.id}`}
            style={{ x }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleSwipe('like');
              else if (info.offset.x < -100) handleSwipe('dislike');
              else x.set(0);
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={(custom) => ({
              x: swipeDirection === 'right' ? 500 : -500,
              opacity: 0,
              rotate: swipeDirection === 'right' ? 20 : -20,
              transition: { duration: 0.3 }
            })}
            className={`absolute inset-0 rounded-[2.5rem] shadow-2xl overflow-hidden border flex flex-col cursor-grab active:cursor-grabbing shadow-black/40 touch-pan-y ${
              isQuest ? 'border-primary/50 bg-surface' : 'border-background bg-surface'
            }`}
          >
            {/* Swipe Hints */}
            <motion.div 
              style={{ opacity: likeOpacity }} 
              className="absolute top-20 right-10 z-50 border-4 border-primary px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none"
            >
              <span className="text-primary text-4xl font-black font-rajdhani uppercase">JOIN</span>
            </motion.div>
            <motion.div 
              style={{ opacity: dislikeOpacity }} 
              className="absolute top-20 left-10 z-50 border-4 border-alert px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none"
            >
              <span className="text-alert text-4xl font-black font-rajdhani uppercase">SKIP</span>
            </motion.div>

            {isQuest ? (
              /* Quest Card Content */
              <div className="relative flex-1 flex flex-col">
                <div className="h-2/5 relative">
                  <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-light to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="bg-obsidian/60 backdrop-blur-md p-4 rounded-2xl border border-primary/30 flex items-center gap-4 w-full">
                       <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-obsidian shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                         <Gamepad2 size={32} />
                       </div>
                       <div>
                         <div className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">{currentItem.game_id}</div>
                         <div className="text-white font-rajdhani font-bold text-xl leading-tight">ACTIVE MISSION</div>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary text-obsidian text-[10px] font-black uppercase rounded tracking-widest">
                        {currentItem.quest_type}
                      </span>
                      <span className="px-3 py-1 border border-slate-700 text-slate-400 text-[10px] font-bold uppercase rounded tracking-widest">
                        {currentItem.requirements?.skill_level || 'ALL LEVELS'}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-rajdhani font-bold text-white uppercase tracking-tight leading-tight">
                      {currentItem.title}
                    </h2>
                    
                    <p className="text-slate-400 mt-4 text-sm leading-relaxed line-clamp-4 italic">
                      \"{currentItem.description}\"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-obsidian rounded-xl border border-slate-800">
                        <Users className="text-primary w-5 h-5" />
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Squad</div>
                          <div className="text-white font-bold text-xs">{currentItem.filled_slots}/{currentItem.total_slots}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-obsidian rounded-xl border border-slate-800">
                        <Clock className="text-secondary w-5 h-5" />
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Start</div>
                          <div className="text-white font-bold text-xs">{currentItem.start_time}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                      <img 
                        src={currentItem.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentItem.creator_name}`} 
                        className="w-10 h-10 rounded-full border border-primary/30"
                        alt=""
                      />
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase font-bold">Lead by</div>
                        <div className="text-white font-medium text-sm">{currentItem.creator_name}</div>
                      </div>
                      <div className="ml-auto">
                         <span className="text-[10px] text-primary font-bold animate-pulse">JOIN SQUAD →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* User Card Content */
              <div className="relative flex-1">
                <img
                  src={currentItem.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentItem.username}`}
                  alt={currentItem.username}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  {(typeof currentItem.platforms === 'string' ? JSON.parse(currentItem.platforms) : currentItem.platforms)?.map(platform => (
                    <span key={platform} className="px-3 py-1 bg-surface/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-text-high uppercase tracking-widest">
                      {platform}
                    </span>
                  ))}
                </div>
                
                <div className="absolute top-6 right-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg border-2 border-background ${
                    currentItem.skill_level === 'Pro' ? 'bg-primary text-background' :
                    currentItem.skill_level === 'Competitive' ? 'bg-secondary text-text-high' :
                    'bg-background text-text-low'
                  }`}>
                    {currentItem.skill_level}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="text-4xl font-rajdhani font-bold text-text-high flex items-center gap-3 uppercase tracking-tight">
                    {currentItem.username}
                    <span className="text-xl font-normal text-primary">LVL 24</span>
                  </h2>
                  <p className="text-text-low text-sm mt-3 line-clamp-3 leading-relaxed">
                    {currentItem.bio || "No bio yet. Looking for a duo partner to climb the ranks!"}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {(typeof currentItem.games === 'string' ? JSON.parse(currentItem.games) : currentItem.games)?.map(game => (
                      <span key={game} className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-bold text-primary uppercase tracking-wider">
                        {game}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
          className={`w-16 h-16 rounded-full bg-surface border-2 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all shadow-black/40 shadow-primary/10 ${
            isQuest ? 'border-primary text-primary' : 'border-primary/20 text-primary'
          }`}
        >
          <Heart size={32} fill="currentColor" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default Discover;
