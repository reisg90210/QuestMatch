import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, MessageSquare, Calendar, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import communityHeroImg from '../assets/community_hero_banner.png';

const Community = () => {
  const navigate = useNavigate();

  const events = [
    { title: "Neon Night Raid", date: "Friday, 10 PM", participants: 42, game: "Destiny 2" },
    { title: "Valorant Scrims", date: "Saturday, 2 PM", participants: 18, game: "Valorant" },
    { title: "Minecraft Creative Build", date: "Sunday, 11 AM", participants: 12, game: "Minecraft" }
  ];

  const guilds = [
    { name: "Shadow Walkers", members: 120, rating: 4.9, tags: ["Competitive", "Tactical"] },
    { name: "Cyan Knights", members: 85, rating: 4.8, tags: ["Social", "Casual"] },
    { name: "Elite Vanguard", members: 210, rating: 5.0, tags: ["Pro", "Raids"] }
  ];

  return (
    <div className="flex-1 bg-background overflow-y-auto pb-32 font-inter">
      {/* Hero Section */}
      <div className="relative h-80 md:h-[450px] w-full overflow-hidden">
        <motion.img
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      src={communityHeroImg}
                      className="w-full h-full object-cover opacity-70"
                      alt="Community Hero"
                    />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-[0.3em]"
          >
            The Global Lobby
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-rajdhani font-black text-white uppercase tracking-tighter leading-none shadow-black/50 drop-shadow-2xl">
            QuestMatch <span className="text-primary italic">Community</span>
          </h1>
          <p className="text-text-low text-lg max-w-2xl mx-auto font-medium">
            Join thousands of elite gamers in coordinated missions, seasonal events, and professional guilds.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 space-y-16">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Active Raiders", value: "12.4K", icon: Users },
             { label: "Quests Finished", value: "85K", icon: Trophy },
             { label: "Guilds Formed", value: "1.2K", icon: Star },
             { label: "Live Comms", value: "450", icon: MessageSquare }
           ].map((stat, i) => (
             <div key={i} className="bg-surface/80 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col items-center text-center gap-2">
                <stat.icon className="text-primary w-5 h-5 opacity-50" />
                <div className="text-2xl font-rajdhani font-bold text-white leading-none">{stat.value}</div>
                <div className="text-[10px] text-text-low font-black uppercase tracking-widest">{stat.label}</div>
             </div>
           ))}
        </div>

        {/* Upcoming Events */}
        <section className="space-y-8">
           <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-rajdhani font-bold text-white uppercase tracking-tight">Deployment <span className="text-primary">Calendar</span></h2>
                <p className="text-text-low text-sm mt-1">Scheduled community operations and scrims.</p>
              </div>
              <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                Full Schedule <ArrowRight size={14} />
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <div key={i} className="p-6 bg-surface rounded-2xl border border-white/5 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Calendar size={64} className="text-primary" />
                   </div>
                   <div className="text-xs text-primary font-bold uppercase tracking-[0.2em] mb-2">{event.game}</div>
                   <h3 className="text-xl font-rajdhani font-bold text-white mb-4 group-hover:text-primary transition-colors">{event.title}</h3>
                   <div className="flex items-center justify-between mt-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-low font-bold uppercase tracking-widest">Starts</span>
                        <span className="text-sm text-white font-medium">{event.date}</span>
                      </div>
                      <div className="flex -space-x-2">
                         {[1,2,3].map(j => (
                           <div key={j} className="w-8 h-8 rounded-full border-2 border-background bg-slate-800" />
                         ))}
                         <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                           +{event.participants - 3}
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Top Guilds Section */}
        <section className="space-y-8">
           <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-rajdhani font-bold text-white uppercase tracking-tight">Active <span className="text-secondary">Guilds</span></h2>
                <p className="text-text-low text-sm mt-1">Partner with established teams for long-term play.</p>
              </div>
              <button className="text-secondary text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                Register Guild <ArrowRight size={14} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guilds.map((guild, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-surface rounded-2xl border border-white/5 hover:bg-surface-light/30 transition-all cursor-pointer group shadow-lg shadow-black/20">
                   <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-background font-black text-2xl font-rajdhani">
                      {guild.name.charAt(0)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                         <h3 className="text-xl font-rajdhani font-bold text-white truncate">{guild.name}</h3>
                         <div className="flex items-center gap-1 text-secondary text-xs font-bold">
                            <Star size={12} fill="currentColor" /> {guild.rating}
                         </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                         {guild.tags.map(tag => (
                           <span key={tag} className="px-2 py-0.5 rounded bg-background/50 text-[8px] font-bold uppercase tracking-widest text-text-low border border-white/5">{tag}</span>
                         ))}
                      </div>
                      <p className="text-text-low text-xs mt-3 uppercase font-black tracking-widest opacity-50">{guild.members} Active Members</p>
                   </div>
                   <div className="hidden sm:block">
                      <button className="px-6 py-2 border border-secondary/50 text-secondary text-xs font-bold uppercase tracking-widest rounded-lg group-hover:bg-secondary group-hover:text-white transition-all shadow-secondary/10">
                        Join Guild
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* CTA Footer */}
        <section className="py-20">
           <div className="bg-primary/5 rounded-[3rem] border border-primary/20 p-12 text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
              <h2 className="text-4xl md:text-5xl font-rajdhani font-black text-white uppercase tracking-tighter leading-none relative z-10">
                Ready to find <span className="text-primary">your team</span>?
              </h2>
              <p className="text-text-low text-lg max-w-xl mx-auto relative z-10">
                Stop playing solo. Start your next adventure with a squad that matches your tactical vision.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 pt-4">
                 <button 
                   onClick={() => navigate('/discover')}
                   className="px-10 py-5 bg-primary text-background font-black rounded-2xl shadow-[0_0_40px_rgba(0,245,255,0.4)] uppercase tracking-widest text-xl hover:scale-105 active:scale-95 transition-all"
                 >
                   Start Discovery
                 </button>
                 <button 
                   onClick={() => navigate('/create-quest')}
                   className="px-10 py-5 border-2 border-secondary text-text-high font-black rounded-2xl uppercase tracking-widest text-xl hover:bg-secondary transition-all shadow-xl shadow-secondary/10"
                 >
                   Post a Quest
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Community;
