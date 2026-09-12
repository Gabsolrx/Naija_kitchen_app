import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Calendar, Download, Timer, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

export function BottomNav() {
  const { timer } = useAppContext();
  
  const navItems: Array<{ to: string; icon: React.ElementType; label: string; badge?: boolean }> = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/favorites", icon: Heart, label: "Favorites" },

    { to: "/timetable", icon: Calendar, label: "Food Time Table" },
    { to: "/offline", icon: Download, label: "Offline" },
    { to: "/about", icon: Info, label: "About" },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2 pb-safe flex justify-between items-center w-full relative z-50">
      {navItems.map(({ to, icon: Icon, label, badge }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center flex-1 h-12 transition-colors relative",
            isActive ? "text-[var(--color-brand-orange)]" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <div className="relative flex-shrink-0">
            <Icon size={22} strokeWidth={2} />
            {badge && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] font-medium mt-1 leading-none text-center whitespace-nowrap" style={{ letterSpacing: '-0.3px' }}>
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
