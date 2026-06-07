import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Sword, Trophy, Menu, X } from 'lucide-react';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-high font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 transition-all duration-300 bg-background/80 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="QuestMatch" className="w-10 h-10" />
          <span className="text-2xl font-rajdhani font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            QuestMatch
          </span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-text-low hover:text-primary transition-colors">Home</Link>
          <Link to="/explore" className="text-text-low hover:text-primary transition-colors">Explore Quests</Link>
          <Link to="/community" className="text-text-low hover:text-primary transition-colors">Community</Link>
          <Link to="/about" className="text-text-low hover:text-primary transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/login" className="px-6 py-2 text-text-high border-2 border-transparent hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-primary text-background font-bold rounded-lg hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)]">
              Sign Up
            </Link>
          </div>
          
          {/* Hamburger Menu Button */}
          <button 
            className="lg:hidden p-3 text-text-high hover:text-primary transition-colors flex items-center justify-center min-w-[48px] min-h-[48px]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[72px] bg-background/95 backdrop-blur-xl z-40 lg:hidden flex flex-col p-6 gap-6 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-2 text-xl font-rajdhani font-semibold">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-text-high hover:text-primary py-3">Home</Link>
              <Link to="/explore" onClick={() => setIsMenuOpen(false)} className="text-text-high hover:text-primary py-3">Explore Quests</Link>
              <Link to="/community" onClick={() => setIsMenuOpen(false)} className="text-text-high hover:text-primary py-3">Community</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-text-high hover:text-primary py-3">About</Link>
            </nav>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center text-text-high border border-white/10 rounded-xl">
                Login
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center bg-primary text-background font-bold rounded-xl shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
        <div className="flex-1 space-y-6 md:space-y-8 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium border border-primary/20">
            <span className="animate-pulse">⚡</span> 10,000+ matches made this week
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-rajdhani font-bold leading-tight">
            Level Up Your <span className="text-primary">Teamwork</span>. <br className="hidden md:block" />
            Find Your <span className="text-primary">Squad</span> Today.
          </h1>
          <p className="text-lg md:text-xl text-text-low max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Connect with reliable partners for raids, rank climbs, and creative quests. 
            No more solo-queue frustration. Join the community built for collaborators.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <Link to="/signup" className="px-8 py-4 bg-primary text-background text-lg font-bold rounded-xl text-center hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all">
              Get Started - Free
            </Link>
            {/* On mobile, this is pushed after the banner in the audit's proposed hierarchy, 
                but keeping it here for desktop. For mobile we can use order-3 if we split the container.
                Wait, the audit said: Headline > Sub-headline > Primary CTA > Cinematic Banner > Secondary CTA.
            */}
            <div className="hidden lg:block">
              <Link to="/explore" className="px-8 py-4 border-2 border-secondary text-text-high text-lg font-bold rounded-xl text-center hover:bg-secondary transition-all">
                Explore Quests
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 relative order-1 lg:order-2 w-full max-w-2xl mx-auto lg:max-w-none">
          <div className="absolute -inset-4 bg-secondary/20 blur-3xl rounded-full" />
          <div className="relative border border-surface-light/20 rounded-2xl overflow-hidden shadow-2xl shadow-secondary/10 max-h-[300px] lg:max-h-none">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000" 
              alt="Gaming Collaboration" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </div>

        {/* Mobile Secondary CTA */}
        <div className="lg:hidden w-full order-3">
          <Link to="/explore" className="block w-full px-8 py-4 border-2 border-secondary text-text-high text-lg font-bold rounded-xl text-center hover:bg-secondary transition-all">
            Explore Quests
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "Smart Matching", desc: "Our algorithm finds partners based on skill level and shared interests." },
            { icon: Shield, title: "Verified Squads", desc: "Play with trust. See community ratings and completion stats." },
            { icon: Sword, title: "Quest Posting", desc: "Need a healer? Looking for a duo? Post your quest and find matches." }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-surface rounded-2xl border border-background hover:border-primary/30 transition-all group">
              <feature.icon className="w-12 h-12 text-secondary mb-6 group-hover:text-primary transition-colors" />
              <h3 className="text-2xl font-rajdhani font-bold mb-4">{feature.title}</h3>
              <p className="text-text-low">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
