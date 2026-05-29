import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Heart, User, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: Compass, label: 'Discover', path: '/' },
    { icon: Heart, label: 'Matches', path: '/matches' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#14141f]/95 backdrop-blur-lg border-t border-[#2a2a3e] flex justify-around items-center h-20 px-6 z-50">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-[#7c3aed] scale-110' : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            <div className="relative p-1">
              <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              {item.label === 'Matches' && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#ec4899] rounded-full border-2 border-[#14141f]" />
              )}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navbar;
