import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { quests } from '../services/api';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Users, 
  Clock, 
  Gamepad2, 
  Trophy, 
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';

const GAMES = [
  { id: 'valorant', name: 'Valorant', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f2?auto=format&fit=crop&q=80&w=200' },
  { id: 'league-of-legends', name: 'League of Legends', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200' },
  { id: 'elden-ring', name: 'Elden Ring', image: 'https://images.unsplash.com/photo-1612285335132-136709848f76?auto=format&fit=crop&q=80&w=200' },
  { id: 'minecraft', name: 'Minecraft', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=200' },
  { id: 'apex-legends', name: 'Apex Legends', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=200' },
  { id: 'destiny-2', name: 'Destiny 2', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=200' },
];

const QUEST_TYPES = [
  { id: 'ranked', name: 'Ranked Push', icon: Trophy, description: 'Climb the competitive ladder together.' },
  { id: 'casual', name: 'Casual Play', icon: Gamepad2, description: 'Chill vibes and fun sessions.' },
  { id: 'raid', name: 'Raid/Boss', icon: Users, description: 'Tackle high-end PvE content.' },
];

const CreateQuest = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    game_id: '',
    quest_type: '',
    title: '',
    description: '',
    requirements: {
      skill_level: 'Intermediate',
      mic_required: true,
      language: 'English'
    },
    total_slots: 4,
    start_time: 'As soon as full'
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const filteredGames = GAMES.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await quests.create(formData);
      setStep(5); // Success state
    } catch (err) {
      console.error('Failed to create quest:', err);
      alert('Failed to create quest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-obsidian-light border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {filteredGames.map(game => (
          <button
            key={game.id}
            onClick={() => {
              setFormData({ ...formData, game_id: game.id });
              nextStep();
            }}
            className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
              formData.game_id === game.id ? 'border-primary' : 'border-transparent hover:border-slate-700'
            }`}
          >
            <img src={game.image} alt={game.name} className="w-full h-32 object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-rajdhani font-bold text-lg text-center px-2">{game.name}</span>
            </div>
            {formData.game_id === game.id && (
              <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                <CheckCircle2 className="w-4 h-4 text-obsidian" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="grid gap-4">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Quest Type</label>
        <div className="grid gap-3">
          {QUEST_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setFormData({ ...formData, quest_type: type.id })}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                formData.quest_type === type.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-slate-800 bg-obsidian-light hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-lg ${formData.quest_type === type.id ? 'bg-primary text-obsidian' : 'bg-slate-800 text-slate-400'}`}>
                <type.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-rajdhani font-bold text-white">{type.name}</div>
                <div className="text-sm text-slate-500">{type.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Quest Title</label>
          <input 
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Gold Rank Push Tonight!"
            className="w-full bg-obsidian-light border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Description</label>
          <textarea 
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What are we doing? Any specific goals?"
            className="w-full bg-obsidian-light border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-primary outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Slots Available</label>
        <div className="flex items-center justify-between p-4 bg-obsidian-light rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-white font-medium">Squad Size</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setFormData({ ...formData, total_slots: Math.max(2, formData.total_slots - 1) })}
              className="p-1 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-2xl font-rajdhani font-bold text-primary w-8 text-center">{formData.total_slots}</span>
            <button 
              onClick={() => setFormData({ ...formData, total_slots: Math.min(10, formData.total_slots + 1) })}
              className="p-1 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Skill Level</label>
        <div className="flex flex-wrap gap-2">
          {['Beginner', 'Intermediate', 'Advanced', 'Pro'].map(level => (
            <button
              key={level}
              onClick={() => setFormData({ ...formData, requirements: { ...formData.requirements, skill_level: level }})}
              className={`px-4 py-2 rounded-full border transition-all ${
                formData.requirements.skill_level === level
                  ? 'border-secondary bg-secondary/10 text-secondary'
                  : 'border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Timeframe</label>
        <div className="grid grid-cols-2 gap-3">
          {['As soon as full', 'Tonight', 'Weekend', 'Custom'].map(time => (
            <button
              key={time}
              onClick={() => setFormData({ ...formData, start_time: time })}
              className={`p-3 rounded-xl border transition-all text-sm ${
                formData.start_time === time
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const game = GAMES.find(g => g.id === formData.game_id);
    const type = QUEST_TYPES.find(t => t.id === formData.quest_type);

    return (
      <div className="space-y-8">
        <div className="bg-obsidian-light rounded-2xl border-2 border-primary/20 overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <div className="h-24 relative">
            <img src={game?.image} alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-light to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary text-obsidian text-[10px] font-bold uppercase tracking-widest">
                {type?.name}
              </span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-rajdhani font-bold text-white leading-tight">
              {formData.title || 'Quest Title'}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2">
              {formData.description || 'No description provided.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="w-4 h-4 text-primary" />
                <span>{formData.total_slots} Slots</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-secondary" />
                <span>{formData.start_time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Gamepad2 className="w-4 h-4 text-primary" />
                <span>{game?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Trophy className="w-4 h-4 text-secondary" />
                <span>{formData.requirements.skill_level}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            By posting this quest, you agree to lead the squad and maintain a positive gaming environment.
          </p>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 space-y-6"
    >
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse" />
        <div className="relative bg-primary rounded-full p-6 inline-block shadow-[0_0_30px_rgba(0,255,255,0.3)]">
          <CheckCircle2 className="w-12 h-12 text-obsidian" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-rajdhani font-bold text-white">Quest Initiated!</h2>
        <p className="text-slate-400">Your beacon is live. Squad members will be joining soon.</p>
      </div>
      <div className="pt-8 flex flex-col gap-3">
        <button 
          onClick={() => navigate('/discover')}
          className="w-full bg-primary hover:bg-cyan-400 text-obsidian font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)]"
        >
          VIEW IN FEED
        </button>
        <button 
          onClick={() => setStep(1)}
          className="w-full bg-transparent hover:bg-slate-800 text-slate-400 font-medium py-3 rounded-xl transition-all"
        >
          POST ANOTHER
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-obsidian pb-24 pt-8 px-4">
      <div className="max-w-md mx-auto">
        {step < 5 && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              {step > 1 ? (
                <button onClick={prevStep} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              ) : (
                <div className="w-10" />
              )}
              <div className="text-center">
                <h1 className="text-2xl font-rajdhani font-bold text-white tracking-tight uppercase">
                  {step === 1 ? 'Select Game' : step === 2 ? 'Quest Details' : step === 3 ? 'Requirements' : 'Review & Post'}
                </h1>
                <div className="flex justify-center gap-1.5 mt-2">
                  {[1, 2, 3, 4].map(s => (
                    <div 
                      key={s} 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        s === step ? 'w-8 bg-primary shadow-[0_0_10px_rgba(0,255,255,0.5)]' : s < step ? 'w-4 bg-primary/40' : 'w-4 bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-10" />
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderStep4()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-obsidian via-obsidian to-transparent">
              <div className="max-w-md mx-auto">
                {step > 1 && (
                  <button
                    onClick={step === 4 ? handleSubmit : nextStep}
                    disabled={loading || (step === 2 && (!formData.title || !formData.quest_type))}
                    className={`w-full py-4 rounded-xl font-rajdhani font-bold text-lg tracking-wider transition-all flex items-center justify-center gap-2 ${
                      loading || (step === 2 && (!formData.title || !formData.quest_type))
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-primary text-obsidian hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                    }`}
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                    ) : (
                      <>
                        {step === 4 ? 'INITIALIZE QUEST' : 'CONTINUE'}
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {step === 5 && renderSuccess()}
      </div>
    </div>
  );
};

export default CreateQuest;
