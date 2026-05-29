import React, { useState, useEffect } from 'react';
import { users } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, Save, Camera, Check } from 'lucide-react';

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

  const allPlatforms = ["PC", "PS5", "Xbox", "Nintendo Switch", "Mobile"];
  const allGames = [
    { id: "Apex Legends", name: "Apex Legends", thumb: "/assets/apex-thumbnail.jpg" },
    { id: "Valorant", name: "Valorant", thumb: "/assets/valorant-thumbnail.jpg" },
    { id: "Call of Duty", name: "Call of Duty", thumb: "/assets/cod-thumbnail.jpg" },
    { id: "Fortnite", name: "Fortnite", thumb: "/assets/fortnite-thumbnail.jpg" }
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

  if (loading) return <div className="flex-1 bg-[#0a0a0f] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#2a2a3e] border-t-[#7c3aed] rounded-full animate-spin" /></div>;

  return (
    <div className="flex-1 bg-[#0a0a0f] overflow-y-auto pb-28">
      {/* Header with Background */}
      <div className="relative h-48 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]">
        <div className="absolute inset-0 bg-black/20" />
        <button 
          onClick={logout}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60 transition"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Profile Avatar */}
      <div className="relative flex justify-center -mt-16 px-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] border-4 border-[#0a0a0f] overflow-hidden bg-[#1a1a2e] shadow-2xl">
            <img 
              src={profile.avatar_url || `/assets/avatar-gamer-1.jpg`} 
              className="w-full h-full object-cover" 
              alt="Avatar" 
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-[#7c3aed] p-2.5 rounded-2xl border-4 border-[#0a0a0f] text-white shadow-lg">
            <Camera size={18} />
          </button>
        </div>
      </div>

      <div className="px-6 mt-4 text-center">
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tight">{user?.username || 'Gamer'}</h1>
        <p className="text-[#64748b] text-sm font-medium">Lvl 24 • Pro Matchmaking</p>
      </div>

      {/* Form Content */}
      <div className="px-6 mt-10 space-y-8 max-w-lg mx-auto">
        {message && (
          <div className="bg-[#10b981]/10 text-[#10b981] p-4 rounded-2xl text-sm border border-[#10b981]/20 flex items-center gap-3">
            <Check size={18} /> {message}
          </div>
        )}

        <section className="space-y-3">
          <h3 className="text-[#94a3b8] text-xs font-black uppercase tracking-[0.2em]">Bio</h3>
          <textarea
            className="w-full px-5 py-4 bg-[#1e1e32] border border-[#2a2a3e] rounded-2xl text-[#f1f5f9] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c3aed] transition-colors min-h-[120px] text-sm leading-relaxed"
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            placeholder="Introduce yourself to the lobby..."
          />
        </section>

        <section className="space-y-3">
          <h3 className="text-[#94a3b8] text-xs font-black uppercase tracking-[0.2em]">Skill Level</h3>
          <div className="grid grid-cols-3 gap-3">
            {['Casual', 'Competitive', 'Pro'].map(level => (
              <button
                key={level}
                onClick={() => setProfile({...profile, skill_level: level})}
                className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${
                  profile.skill_level === level 
                    ? 'bg-[#7c3aed] border-[#7c3aed] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                    : 'bg-[#14141f] border-[#2a2a3e] text-[#64748b] hover:border-[#7c3aed]/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[#94a3b8] text-xs font-black uppercase tracking-[0.2em]">Platforms</h3>
          <div className="flex flex-wrap gap-2">
            {allPlatforms.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  profile.platforms.includes(p) 
                    ? 'bg-[#06b6d4]/10 border-[#06b6d4] text-[#22d3ee]' 
                    : 'bg-[#14141f] border-[#2a2a3e] text-[#64748b]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[#94a3b8] text-xs font-black uppercase tracking-[0.2em]">Favorite Games</h3>
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
            <div className="flex gap-4 pb-2">
              {allGames.map(game => {
                const isSelected = profile.games.includes(game.id);
                return (
                  <div
                    key={game.id}
                    className={`relative flex-shrink-0 w-36 h-48 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-[#7c3aed] scale-105 shadow-[0_0_20px_rgba(124,58,237,0.3)]' : 'border-[#2a2a3e]'
                    }`}
                    onClick={() => toggleGame(game.id)}
                  >
                    <img src={game.thumb} className="w-full h-full object-cover" alt={game.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-xs leading-tight">{game.name}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#7c3aed] flex items-center justify-center border-2 border-white/20">
                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-2xl text-white font-black text-lg uppercase tracking-widest hover:opacity-90 transition shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3 mt-10"
        >
          {saving ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={22} /> Update Profile</>}
        </button>
      </div>
    </div>
  );
};

export default Profile;
