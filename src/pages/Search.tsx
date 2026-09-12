import React, { useState, useMemo } from 'react';
import { TopBar } from '../components/TopBar';
import { RecipeCard } from '../components/RecipeCard';
import { useAppContext } from '../context/AppContext';

export function Search() {
  const { recipes } = useAppContext();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return recipes.filter(r => r && (
      (r.name && r.name.toLowerCase().includes(lowerQuery)) ||
      (r.category && r.category.toLowerCase().includes(lowerQuery)) ||
      (r.searchKeywords && r.searchKeywords.some(k => k.toLowerCase().includes(lowerQuery))) ||
      (r.ingredients && r.ingredients.some(i => i.toLowerCase().includes(lowerQuery)))
    ));
  }, [query]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <TopBar title="Search Recipes" showBack />
      
      <div className="p-4 border-b border-gray-100 bg-white">
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Jollof, Egusi, Beans..."
          className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)] transition-all"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {query.trim() === "" ? (
          <div className="text-center py-10">
            <h3 className="font-semibold text-gray-700 mb-2">Try searching for:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Jollof", "Egusi", "Beans", "Chicken", "Quick meals"].map(t => (
                <button 
                  key={t}
                  onClick={() => setQuery(t)}
                  className="px-3 py-1.5 bg-[var(--color-brand-cream)] text-[var(--color-brand-orange)] rounded-full text-sm font-medium"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-3 pb-6">
            <p className="text-sm text-gray-500 mb-2 font-medium">Found {results.length} recipes</p>
            {results.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-2 text-4xl">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900">No recipes found</h3>
            <p className="text-gray-500 text-sm mt-1">Try a different search term or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
