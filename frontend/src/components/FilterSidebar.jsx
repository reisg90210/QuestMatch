import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Sliders, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FilterSidebar = ({ isOpen, onClose, isPremium, filters, setFilters }) => {
  const navigate = useNavigate();

  const playstyles = ["Aggressive", "Tactical", "Support", "Casual", "Completionist"];
  
  const handlePremiumClick = () => {
    if (!isPremium) {
      navigate('/premium');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-[60]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-surface border-l border-background z-[70] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-background">
              <div className="flex items-center gap-2">
                <Sliders size={20} className="text-primary" />
                <h2 className="text-xl font-rajdhani font-bold text-white uppercase tracking-wider">Tactical Filters</h2>
              </div>
              <button onClick={onClose} className="text-text-low hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Basic Filters (Skill Level) */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-text-low uppercase tracking-[0.2em]">Minimum Skill Level</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Beginner", "Casual", "Competitive", "Pro"].map(level => (
                    <button
                      key={level}
                      onClick={() => setFilters({ ...filters, skillLevel: level })}
                      className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                        filters.skillLevel === level 
                          ? 'bg-primary/20 border-primary text-primary' 
                          : 'bg-background border-transparent text-text-low hover:border-white/10'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Filters: Playstyle */}
              <div className={`space-y-4 ${!isPremium ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-text-low uppercase tracking-[0.2em]">Preferred Playstyle</h3>
                  {!isPremium && <Lock size={12} className="text-primary" />}
                </div>
                
                <div className="relative">
                  <div className="grid gap-2">
                    {playstyles.map(style => (
                      <button
                        key={style}
                        disabled={!isPremium}
                        onClick={() => setFilters({ ...filters, playstyle: style })}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                          filters.playstyle === style 
                            ? 'bg-primary/10 border-primary/30 text-primary' 
                            : 'bg-background border-transparent text-text-low'
                        }`}
                      >
                        {style}
                        {filters.playstyle === style && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                  
                  {!isPremium && (
                    <div 
                      className="absolute inset-0 cursor-pointer" 
                      onClick={handlePremiumClick}
                    />
                  )}
                </div>
              </div>

              {/* Premium Filters: Hardware */}
              <div className={`space-y-4 ${!isPremium ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-text-low uppercase tracking-[0.2em]">Hardware Type</h3>
                  {!isPremium && <Lock size={12} className="text-primary" />}
                </div>
                
                <div className="relative">
                   <div className="flex flex-wrap gap-2">
                      {["Controller", "KBM", "High-End PC"].map(hw => (
                        <button
                          key={hw}
                          disabled={!isPremium}
                          onClick={() => setFilters({ ...filters, hardware: hw })}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            filters.hardware === hw 
                              ? 'bg-secondary/20 border-secondary text-secondary' 
                              : 'bg-background border-transparent text-text-low'
                          }`}
                        >
                          {hw}
                        </button>
                      ))}
                   </div>
                   {!isPremium && (
                    <div 
                      className="absolute inset-0 cursor-pointer" 
                      onClick={handlePremiumClick}
                    />
                  )}
                </div>
              </div>
            </div>

            {!isPremium && (
              <div className="p-6 bg-primary/5 border-t border-primary/20">
                <p className="text-xs text-text-low mb-4">Upgrade to <span className="text-primary font-bold">Elite Questor</span> to unlock tactical filtering and priority matching.</p>
                <button 
                  onClick={handlePremiumClick}
                  className="w-full py-3 bg-primary text-obsidian font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.2)] uppercase text-xs tracking-widest"
                >
                  Go Premium
                </button>
              </div>
            )}
            
            {isPremium && (
              <div className="p-6 border-t border-background">
                 <button 
                  onClick={onClose}
                  className="w-full py-3 bg-background text-white font-bold rounded-xl border border-white/10 uppercase text-xs tracking-widest hover:bg-surface-light transition-all"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;
