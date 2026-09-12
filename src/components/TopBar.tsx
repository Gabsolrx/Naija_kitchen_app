import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Share2, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showShare?: boolean;
  showAdmin?: boolean;
  onShare?: () => void;
  transparent?: boolean;
}

export function TopBar({ title, showBack, showSearch, showShare, onShare, transparent, showAdmin }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header 
      className={cn(
        "flex items-center justify-between px-4 h-14 shrink-0 transition-colors z-40",
        transparent ? "bg-gradient-to-b from-black/60 to-transparent absolute top-0 left-0 w-full text-white" : "bg-white text-gray-900 border-b border-gray-100"
      )}
    >
      <div className="flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--color-brand-orange)] flex items-center justify-center text-white font-bold text-xl leading-none pt-1">
            N
          </div>
        )}
        <h1 className={cn("font-semibold text-lg line-clamp-1", transparent && "text-white")}>
          {title || "NaijaKitchen"}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        {showSearch && (
          <Link to="/search" className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
            <Search size={22} />
          </Link>
        )}
        {showShare && (
          <button onClick={onShare} className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
            <Share2 size={22} />
          </button>
        )}
        {showAdmin && (
          <Link to="/admin" className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
            <Settings size={22} />
          </Link>
        )}
      </div>
    </header>
  );
}
