import React from 'react';
import { TopBar } from '../components/TopBar';
import { RecipeCard } from '../components/RecipeCard';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = ["All", "Swallows", "Soup", "Rice", "Stew", "Breakfast", "Drinks", "Snacks"];

export function Home() {
  const { recipes } = useAppContext();
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [visibleCount, setVisibleCount] = React.useState(10);

  React.useEffect(() => {
    setVisibleCount(10);
  }, [activeCategory]);

  const filteredRecipes = React.useMemo(() => {
    if (activeCategory === "All") return recipes;
    return recipes.filter(r => r.category === activeCategory);
  }, [activeCategory, recipes]);

  const featuredRecipe = recipes.find(r => r.id === "r1") || recipes[0];
  const allCategoryRecipes = filteredRecipes.filter(r => featuredRecipe ? r.id !== featuredRecipe.id : true);
  const popularRecipes = allCategoryRecipes.slice(0, visibleCount);
  const hasMore = allCategoryRecipes.length > visibleCount;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <TopBar showSearch />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What would you like to cook today?</h2>
          
          {featuredRecipe && <RecipeCard recipe={featuredRecipe} featured />}
        </div>

        {/* Categories */}
        <div className="px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[var(--color-brand-blue)] text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Popular List */}
        <div className="p-4 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {activeCategory === "All" ? "Popular Recipes" : `${activeCategory} Recipes`}
            </h3>
          </div>
          
          <div className="flex flex-col gap-3 pb-6">
            {popularRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
            {popularRecipes.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                No recipes found in this category.
              </div>
            )}
            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="px-6 py-2 rounded-full bg-[var(--color-brand-blue)] text-white font-semibold text-sm active:scale-95 transition-transform"
                >
                  See More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
