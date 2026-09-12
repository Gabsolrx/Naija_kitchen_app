import React from 'react';
import { TopBar } from '../components/TopBar';
import { RecipeCard } from '../components/RecipeCard';

import { useAppContext } from '../context/AppContext';
import { Heart } from 'lucide-react';

export function Favorites() {
  const { favorites, recipes } = useAppContext();
  
  const favoriteRecipes = React.useMemo(() => {
    return recipes.filter(r => r && favorites.includes(r.id));
  }, [favorites]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <TopBar title="My Favorites" />
      
      <div className="flex-1 overflow-y-auto p-4">
        {favoriteRecipes.length > 0 ? (
          <div className="flex flex-col gap-3 pb-6">
            {favoriteRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500">
              Tap the heart icon on any recipe to save it here for quick access later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
