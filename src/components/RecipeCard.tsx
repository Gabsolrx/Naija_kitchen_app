import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdMobService } from '../lib/admob';
import { Heart, Clock } from 'lucide-react';
import { Recipe } from '../types';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

interface RecipeCardProps {
  key?: React.Key;
  recipe: Recipe;
  featured?: boolean;
}

export function RecipeCard({ recipe, featured }: RecipeCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, isOfflineAvailable } = useAppContext();
  const [isNavigating, setIsNavigating] = React.useState(false);
  
  if (!recipe) return null;
  const favorite = isFavorite(recipe.id);
  const offline = isOfflineAvailable(recipe.id);
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  const handleNavigate = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    setIsNavigating(true);
    try {
      await AdMobService.showInterstitialWithCap();
      navigate(`/recipe/${recipe.id}`);
    } finally {
      setIsNavigating(false);
    }
  };

  if (featured) {
    return (
      <div onClick={handleNavigate} className="block cursor-pointer relative w-full h-64 rounded-3xl overflow-hidden shadow-lg active:scale-[0.98] transition-transform">
        <img src={recipe.imageUrl || undefined} alt={recipe.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <button 
          onClick={handleFavorite}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center active:scale-90 transition-transform"
        >
          <Heart size={22} className={cn(favorite ? "fill-[var(--color-brand-orange)] text-[var(--color-brand-orange)]" : "text-white")} />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-[var(--color-brand-orange)] rounded-full">
              {recipe.category}
            </span>
            {offline && (
              <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-green-500 rounded-full">
                Offline
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold leading-tight mb-1">{recipe.name}</h3>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleNavigate} className="flex cursor-pointer gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
        <img src={recipe.imageUrl || undefined} alt={recipe.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 pr-2">{recipe.name}</h4>
            <button onClick={handleFavorite} className="p-1 -m-1 active:scale-90 transition-transform shrink-0">
              <Heart size={18} className={cn(favorite ? "fill-[var(--color-brand-orange)] text-[var(--color-brand-orange)]" : "text-gray-300")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
