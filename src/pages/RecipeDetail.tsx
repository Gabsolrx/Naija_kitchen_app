import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Flame, ChevronRight, Download } from 'lucide-react';
import { TopBar } from '../components/TopBar';

import { useAppContext } from '../context/AppContext';
import { AdMobService } from '../lib/admob';
import { cn } from '../lib/utils';

export function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, isFavorite, toggleFavorite, startTimer, isOfflineAvailable } = useAppContext();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('ingredients');
  }, [id]);

  const recipe = recipes.find(r => r && r.id === id);
  
  if (!recipe) {
    return <div className="p-10 text-center">Recipe not found</div>;
  }

  const favorite = isFavorite(recipe.id);
  const offline = isOfflineAvailable(recipe.id);

  const handleNextRecipe = async () => {
    try {
      // Find recipes in the same category
      let candidates = recipes.filter(r => r && r.category === recipe.category);
      
      // If there's only 1 recipe in this category, use ALL recipes to ensure it goes to a new one
      if (candidates.length <= 1) {
        candidates = recipes.filter(r => r);
      }
      
      const currentIndex = candidates.findIndex(r => r.id === recipe.id);
      // Safe fallback if not found
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextRecipe = candidates[(safeIndex + 1) % candidates.length];
      
      if (nextRecipe) {
        await AdMobService.showInterstitial();
        navigate(`/recipe/${nextRecipe.id}`, { replace: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `NaijaKitchen: ${recipe.name}`,
        text: `Check out this Nigerian recipe on NaijaKitchen: ${recipe.name}. Ingredients and step-by-step cooking instructions are available in NaijaKitchen.`,
        url: window.location.href, // Placeholder for Play Store URL
      }).catch(console.error);
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const handleStartTimer = () => {
    startTimer(recipe.id, recipe.timerDuration);
    navigate('/timer');
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      <TopBar 
        transparent 
        showBack 
        showShare 
        onShare={handleShare}
      />
      
      <div className="flex-1 overflow-y-auto pb-safe">
        {/* Header Image */}
        <div className="h-72 w-full relative">
          <img src={recipe.imageUrl || undefined} alt={recipe.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/40" />
          
          {/* Favorite FAB */}
          <button 
            onClick={() => toggleFavorite(recipe.id)}
            className="absolute -bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-10 border border-gray-100"
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", favorite ? "bg-[var(--color-brand-cream)]" : "bg-gray-50")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={favorite ? "var(--color-brand-orange)" : "none"} stroke={favorite ? "var(--color-brand-orange)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={favorite ? "" : "text-gray-400"}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
          </button>
        </div>

        <div className="px-5 pt-4 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-[var(--color-brand-blue)] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              {recipe.category}
            </span>
            {offline && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                <Download size={10} /> Offline Ready
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{recipe.name}</h1>

          {recipe.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 mt-2">
              {recipe.description}
            </p>
          )}

          
          


          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setActiveTab('ingredients')}
              className={cn("flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all", activeTab === 'ingredients' ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}
            >
              Ingredients
            </button>
            <button 
              onClick={() => setActiveTab('instructions')}
              className={cn("flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all", activeTab === 'instructions' ? "bg-white shadow-sm text-gray-900" : "text-gray-500")}
            >
              Instructions
            </button>
          </div>

          {/* Content */}
          <div className="min-h-[300px]">
            {activeTab === 'ingredients' ? (
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => {
                  if (ing.startsWith('## ')) {
                    return (
                      <div key={idx} className="col-span-full pt-2 pb-1">
                         <h3 className="text-lg font-bold text-[var(--color-brand-orange)] border-b border-gray-100 pb-2">{ing.replace('## ', '')}</h3>
                      </div>
                    );
                  }
                  return (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-orange)] mt-2 shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{ing}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="space-y-6">
                {(() => {
                  let stepNumber = 0;
                  return recipe.instructions.map((inst, idx) => {
                    if (inst.startsWith('## ')) {
                      stepNumber = 0;
                      return (
                        <div key={idx} className="col-span-full pt-4 pb-1">
                          <h3 className="text-lg font-bold text-[var(--color-brand-orange)] border-b border-gray-100 pb-2">{inst.replace('## ', '')}</h3>
                        </div>
                      );
                    }
                    stepNumber++;
                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-brand-cream)] text-[var(--color-brand-orange)] flex items-center justify-center font-bold text-sm">
                          {stepNumber}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">{inst}</p>
                      </div>
                    );
                  });
                })()}
                

              </div>
            )}
          </div>

          <button 
            onClick={handleNextRecipe}
            className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-gray-900/20"
          >
            Next Recipe <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
