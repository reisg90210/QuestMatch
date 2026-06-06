import React, { useState, useEffect } from 'react';
import { users } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Save, Camera, Check, X } from 'lucide-react';

const Profile = () => {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState({
    bio: '',
    platforms: [],
    games: [],
    skill_level: 'Casual',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const allPlatforms = ["PC", "PS5", "Xbox", "Nintendo Switch", "Mobile"];
  const allGames = [
    { id: "Apex Legends", name: "Apex Legends", thumb: "/assets/apex-thumbnail.jpg" },
    { id: "Valorant", name: "Valorant", thumb: "/assets/valorant-thumbnail.jpg" },
    { id: "Call of Duty", name: "Call of Duty", thumb: "/assets/cod-thumbnail.jpg" },
    { id: "Fortnite", name: "Fortnite", thumb: "/assets/fortnite-thumbnail.jpg" }
  ];

  const avatars = [
    "/assets/avatar-gamer-1.jpg",
    "/assets/avatar-gamer-2.jpg",
    "/assets/avatar-gamer-3.jpg",
    "/assets/avatar-gamer-4.jpg",
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
        skill_level: response.data.skill_level || 'Casual'
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

  if (loading) return <div className="flex-1 bg-background flex items-center justify-center"><div className="w-10 h-10 border-4 border-surface border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="flex-1 bg-background overflow-y-auto pb-28 font-inter">
      {/* Header with Background */}
      <div className="relative h-56 bg-gradient-to-br from-secondary via-background to-primary/20">
        <div className="absolute inset-0 bg-background/40" />
        <button 
          onClick={logout}
          className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md p-2.5 rounded-full text-text-high hover:text-alert transition-colors border border-white/5"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Profile Avatar */}
      <div className="relative flex justify-center -mt-20 px-6">
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-4 border-background overflow-hidden bg-surface shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <img 
              src={profile.avatar_url || `/assets/avatar-gamer-1.jpg`} 
              className="w-full h-full object-cover" 
              alt="Avatar" 
            />
          </div>
          <button 
            onClick={() => setIsPickerOpen(true)}
            className="absolute bottom-2 right-2 bg-primary p-3 rounded-full border-4 border-background text-background shadow-lg hover:scale-110 transition-transform"
          >
            <Camera size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 mt-6 text-center">
        <h1 className="text-4xl font-rajdhani font-bold text-primary uppercase tracking-tight">{user?.username || 'Gamer'}</h1>
        <p className="text-text-low text-sm font-medium mt-1">LVL 24 • LEGENDARY EXPLORER</p>
      </div>

      {/* Form Content */}
      <div className="px-6 mt-12 space-y-12 max-w-lg mx-auto">
        {message && (
          <div className="bg-primary/10 text-primary p-4 rounded-2xl text-sm border border-primary/20 flex items-center gap-3 animate-fade-up">
            <Check size={18} /> {message}
          </div>
        )}

        <section className="space-y-4">
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani">Biography</h3>
          <textarea
            className="w-full px-5 py-4 bg-surface border border-background rounded-2xl text-text-high placeholder:text-text-low focus:outline-none focus:border-primary transition-colors min-h-[120px] text-sm leading-relaxed shadow-inner"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            placeholder="Introduce yourself to the lobby..."
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani">Skill Level</h3>
          <div className="grid grid-cols-3 gap-3">
            {['Casual', 'Competitive', 'Pro'].map(level => (
              <button
                key={level}
                onClick={() => setProfile({...profile, skill_level: level})}
                className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                  profile.skill_level === level 
                    ? 'bg-primary border-primary text-background shadow-[0_0_20px_rgba(0,245,255,0.3)]' 
                    : 'bg-surface border-background text-text-low hover:border-primary/50'
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
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  profile.platforms.includes(p) 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-surface border-background text-text-low'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-text-low text-xs font-bold uppercase tracking-[0.3em] font-rajdhani">Combat Library</h3>
          <div className="grid grid-cols-2 gap-4">
              {allGames.map(game => {
                const isSelected = profile.games.includes(game.id);
                return (
                  <div
                    key={game.id}
                    className={`relative aspect-[4/5] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-primary scale-105 shadow-[0_0_20px_rgba(0,245,255,0.2)]' : 'border-background grayscale hover:grayscale-0'
                    }`}
                    onClick={() => toggleGame(game.id)}
                  >
                    <img src={game.thumb} className="w-full h-full object-cover" alt={game.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-text-high font-rajdhani font-bold text-sm leading-tight uppercase tracking-tight">{game.name}</p>
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
          <div className="bg-surface p-4 rounded-2xl border border-background">
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
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-5 bg-primary text-background rounded-2xl font-rajdhani font-bold text-xl uppercase tracking-widest hover:brightness-110 transition shadow-[0_0_30px_rgba(0,245,255,0.2)] flex items-center justify-center gap-3 mt-10"
        >
          {saving ? <div className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <><Save size={22} /> Sync Profile</>}
        </button>
      </div>
    </div>
  );
};

export default Profile;
