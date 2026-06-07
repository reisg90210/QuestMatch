import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Heart, User, MessageCircle, PlusCircle, Bell } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Compass, label: 'Discover', path: '/discover' },
    { icon: PlusCircle, label: 'Create', path: '/create-quest' },
    { icon: Bell, label: 'Activity', path: '/notifications' },
    { icon: Heart, label: 'Matches', path: '/matches' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-surface flex justify-around items-center h-20 px-6 z-50">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-primary scale-110' : 'text-text-low hover:text-text-high'
            }`}
          >
            <div className="relative p-1">
              {isActive && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
              )}
              <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              {(item.label === 'Matches' || item.label === 'Activity') && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-alert rounded-full border-2 border-background shadow-[0_0_10px_rgba(255,0,110,0.5)]" />
              )}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest font-rajdhani ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navbar;
