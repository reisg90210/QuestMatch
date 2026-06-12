import React, { useState, useEffect } from 'react';
import { users } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Save, Camera, Check, X, ShieldCheck, Zap } from 'lucide-react';
import VerifiedBadge from '../components/VerifiedBadge';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    bio: '',
    platforms: [],
    games: [],
    skill_level: 'Casual',
    avatar_url: '',
    is_premium: false,
    is_verified: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const allPlatforms = ["PC", "PS5", "Xbox", "Nintendo Switch", "Mobile"];
  const allGames = [
    { id: "Apex Legends", name: "Apex Legends", thumb: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=400" },
    { id: "Valorant", name: "Valorant", thumb: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f2?auto=format&fit=crop&q=80&w=400" },
    { id: "League of Legends", name: "League of Legends", thumb: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400" },
    { id: "Minecraft", name: "Minecraft", thumb: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400" }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await users.getProfile();
      setProfile(prev => ({
        ...prev,
        ...response.data,
        platforms: response.data.platforms || [],
        games: response.data.games || [],
        skill_level: response.data.skill_level || 'Casual',
        is_premium: !!response.data.is_premium,
        is_verified: !!response.data.is_verified
      }));
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await users.updateProfile(profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const togglePlatform = (p) => {
    setProfile(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter(item => item !== p)
        : [...prev.platforms, p]
    }));
  };

  const toggleGame = (gId) => {
    setProfile(prev => ({
      ...prev,
      games: prev.games.includes(gId)
        ? prev.games.filter(item => item !== gId)
        : [...prev.games, gId]
    }));
  };

  if (loading) return (
    <div className="flex-1 bg-background flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-surface border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex-1 bg-background overflow-y-auto pb-40 font-inter">
      {/* Header with Background */}
      <div className="relative h-48 bg-gradient-to-br from-secondary via-background to-primary/20">
        <div className="absolute inset-0 bg-background/40" />
        <button 
          onClick={logout}
          className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md p-3.5 rounded-full text-text-high hover:text-alert transition-colors border border-white/5"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Profile Avatar & Identity */}
      <div className="relative px-6 -mt-12 max-w-lg mx-auto flex flex-col items-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-surface shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <img 
              src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
              className="w-full h-full object-cover" 
              alt="Avatar" 
            />
          </div>
          <button 
            onClick={() => setIsPickerOpen(true)}
            className="absolute bottom-1 right-1 bg-primary p-2.5 rounded-full border-4 border-background text-background shadow-lg hover:scale-110 transition-transform"
          >
            <Camera size={18} />
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-rajdhani font-bold text-white uppercase tracking-tight leading-none">{user?.username || 'Gamer'}</h1>
            {profile.is_verified && <VerifiedBadge size={22} />}
          </div>
          
          <div className="mt-2 flex flex-col items-center gap-2">
            {profile.is_premium ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(0,245,255,0.1)] animate-pulse">
                <Zap size={12} fill="currentColor" />
                Elite Questor
              </div>
            ) : (
              <button 
                onClick={() => navigate('/premium')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-bold text-[10px] uppercase tracking-widest hover:bg-secondary/20 transition-all"
              >
                <Zap size={10} fill="currentColor" />
                Upgrade to Elite
              </button>
            )}
            <p className="text-text-low text-[10px] font-black uppercase tracking-[0.2em] opacity-60">LVL 24 • LEGENDARY EXPLORER</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 mt-10 space-y-12 max-w-lg mx-auto">
        {message && (
          <div className="bg-primary/10 text-primary p-4 rounded-2xl text-sm border border-primary/20 flex items-center gap-3 animate-fade-up">
            <Check size={18} /> {message}
          </div>
        )}

        <section className="space-y-4">
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" /> Tactical Biography
          </h3>
          <textarea
            className="w-full px-5 py-4 bg-surface border border-white/5 rounded-2xl text-white text-base placeholder:text-text-low focus:outline-none focus:border-primary/50 transition-all min-h-[120px] leading-relaxed shadow-inner"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            placeholder="Introduce yourself to the lobby..."
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani flex items-center gap-2">
            <Zap size={14} className="text-primary" /> Combat Expertise
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {['Casual', 'Competitive', 'Pro'].map(level => (
              <button
                key={level}
                onClick={() => setProfile({...profile, skill_level: level})}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                  profile.skill_level === level 
                    ? 'bg-primary border-primary text-background shadow-[0_0_20px_rgba(0,245,255,0.2)]' 
                    : 'bg-surface border-white/5 text-text-low hover:border-primary/30'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani">Deployment Platforms</h3>
          <div className="flex flex-wrap gap-2">
            {allPlatforms.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  profile.platforms.includes(p) 
                    ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,245,255,0.1)]' 
                    : 'bg-surface border-white/5 text-text-low'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani">Combat Library</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allGames.map(game => {
                const isSelected = profile.games.includes(game.id);
                return (
                  <div
                    key={game.id}
                    className={`relative aspect-[16/9] sm:aspect-[4/5] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-primary scale-[1.02] shadow-[0_0_20px_rgba(0,245,255,0.2)]' : 'border-white/5 grayscale hover:grayscale-0'
                    }`}
                    onClick={() => toggleGame(game.id)}
                  >
                    <img src={game.thumb} className="w-full h-full object-cover" alt={game.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-rajdhani font-bold text-sm leading-tight uppercase tracking-tight">{game.name}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-lg">
                        <Check className="w-4 h-4 text-background" strokeWidth={4} />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani">Operational Availability</h3>
          
          {/* Desktop Grid */}
          <div className="hidden sm:block bg-surface p-4 rounded-2xl border border-white/5">
            <div className="grid grid-cols-8 gap-1 text-[10px] text-text-low font-bold uppercase mb-2">
              <div />
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <div key={d} className="text-center">{d}</div>)}
            </div>
            {['Morning', 'Afternoon', 'Evening'].map(time => (
              <div key={time} className="grid grid-cols-8 gap-1 items-center mb-1">
                <div className="text-[10px] text-text-low font-bold uppercase pr-2">{time.slice(0,3)}</div>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-sm border border-background/50 cursor-pointer transition-colors ${
                      (i + time.length) % 3 === 0 ? 'bg-primary shadow-[0_0_5px_rgba(0,245,255,0.4)]' : 'bg-background/40 hover:bg-surface-light/20'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Mobile Daily List */}
          <div className="sm:hidden space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="bg-surface p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                <span className="text-white font-rajdhani font-bold text-sm uppercase tracking-wide w-12 pl-1">{day}</span>
                <div className="flex gap-2 flex-1 justify-end">
                   {['Morning', 'Afternoon', 'Evening'].map((time, j) => {
                      const isActive = (i + time.length) % 3 === 0;
                      return (
                        <button 
                          key={time}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${
                            isActive ? 'bg-primary text-background border-primary shadow-[0_0_10px_rgba(0,245,255,0.4)]' : 'bg-background text-text-low border-white/5'
                          }`}
                        >
                          {time.slice(0,1)}
                        </button>
                      );
                   })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-5 bg-primary text-background rounded-2xl font-rajdhani font-bold text-xl uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,245,255,0.2)] flex items-center justify-center gap-3 mt-10"
        >
          {saving ? <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <><Save size={22} /> Sync Profile</>}
        </button>
      </div>
    </div>
  );
};

export default Profile;
