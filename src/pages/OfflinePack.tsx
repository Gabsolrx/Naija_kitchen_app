import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { useAppContext } from '../context/AppContext';
import { AdMobService } from '../lib/admob';
import { Download, CheckCircle2, Film, Trash2 } from 'lucide-react';

import { RecipeCard } from '../components/RecipeCard';

export function OfflinePack() {
  const { recipes, offlinePack, addOfflineRecipes, removeOfflineRecipe } = useAppContext();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadedRecipes = React.useMemo(() => {
    return recipes.filter(r => r && offlinePack.includes(r.id));
  }, [offlinePack, recipes]);

  const handleUnlock = async () => {
    try {
      // 1. Show Rewarded Ad
      const earnedReward = await AdMobService.showRewarded();
      
      if (earnedReward) {
        // 2. Simulate Downloading
        setDownloading(true);
        
        let p = 0;
        const interval = setInterval(() => {
          p += 10;
          setProgress(p);
          if (p >= 100) {
            clearInterval(interval);
            // 3. Grant Reward (Add 1 random recipe that isn't already downloaded)
            const available = recipes.filter(r => r && !offlinePack.includes(r.id));
            const toDownload = available.slice(0, 1).map(r => r.id);
            addOfflineRecipes(toDownload);
            setDownloading(false);
            setProgress(0);
          }
        }, 300);
      }
    } catch (error) {
      alert("Advertisement unavailable. Please try again later.");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <TopBar title="Offline Recipes" />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header CTA */}
        <div className="bg-[var(--color-brand-blue)] p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download size={32} className="text-[var(--color-brand-yellow)]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Get Offline Packs</h2>
          <p className="text-white/80 text-sm mb-6 max-w-xs mx-auto">
            Download recipes to your device so you can cook anytime, even without an internet connection.
          </p>
          
          {downloading ? (
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="font-bold text-[var(--color-brand-yellow)] mb-2">Downloading {progress}%</p>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-brand-yellow)] transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <button 
              onClick={handleUnlock}
              className="w-full bg-[var(--color-brand-yellow)] text-gray-900 font-bold py-4 rounded-2xl active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2"
            >
              <Film size={20} /> Watch Ad to Unlock 1 Recipe
            </button>
          )}
        </div>

        {/* Downloaded List */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            My Offline Recipes ({downloadedRecipes.length})
          </h3>
          
          {downloadedRecipes.length > 0 ? (
            <div className="flex flex-col gap-3 pb-6">
              {downloadedRecipes.map(recipe => (
                <div key={recipe.id} className="relative">
                  <RecipeCard recipe={recipe} />
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeOfflineRecipe(recipe.id); }}
                    className="absolute bottom-2 right-2 p-2 bg-red-50 text-red-500 rounded-xl active:scale-95 transition-transform"
                    title="Remove from offline pack"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-white rounded-2xl border border-gray-100 border-dashed">
              <p className="text-gray-500 font-medium">You haven't downloaded any recipes yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
