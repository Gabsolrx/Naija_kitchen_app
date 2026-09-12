import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { useAppContext } from '../context/AppContext';

import { Calendar, ChevronRight, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Timetable() {
  const { recipes, timetable, updateTimetable } = useAppContext();
  const [activeDay, setActiveDay] = useState(1);
  const [editingMeal, setEditingMeal] = useState<'breakfast'|'lunch'|'dinner'|null>(null);
  const [customMealText, setCustomMealText] = useState('');

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  const getRecipe = (id: string | null) => {
    if (!id) return null;
    return recipes.find(r => r && r.id === id);
  };

  const currentPlan = timetable[activeDay] || { breakfast: null, lunch: null, dinner: null };
  const hasPlan = currentPlan.breakfast || currentPlan.lunch || currentPlan.dinner;

  const handleSelectRecipe = (recipeId: string) => {
    if (editingMeal) {
      updateTimetable(activeDay, editingMeal, recipeId);
      setEditingMeal(null);
    }
  };

  // Helper to get random recipe (from all recipes as requested)
  const getRandomRecipe = (type: 'breakfast' | 'lunch' | 'dinner', excludeId?: string | null) => {
    const candidates = recipes.filter(r => r && r.id !== excludeId);
    if (candidates.length === 0) return recipes[0];
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const generateDayPlan = () => {
    let breakfast = getRandomRecipe('breakfast');
    let lunch = getRandomRecipe('lunch', breakfast.id);
    let dinner = getRandomRecipe('dinner', lunch.id);
    
    const allRecipes = recipes.filter(r => r);
    const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
    
    if (shuffled.length >= 3) {
      breakfast = shuffled[0];
      lunch = shuffled[1];
      dinner = shuffled[2];
    } else {
      breakfast = getRandomRecipe('breakfast');
      lunch = getRandomRecipe('lunch', breakfast.id);
      dinner = getRandomRecipe('dinner', lunch.id);
    }

    updateTimetable(activeDay, 'breakfast', breakfast.id);
    updateTimetable(activeDay, 'lunch', lunch.id);
    updateTimetable(activeDay, 'dinner', dinner.id);
  };

  // Full recipe list for selection modal
  const recipeOptions = editingMeal ? recipes.filter(r => r) : [];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden relative">
      <TopBar title="Weekly Timetable" />
      
      {/* Day Selector */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`snap-start shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-colors ${
                activeDay === day 
                  ? 'bg-[var(--color-brand-blue)] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span className="text-[12px] font-bold uppercase tracking-widest opacity-80">{daysOfWeek[day - 1]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
            <Calendar className="text-[var(--color-brand-orange)]" />
            Plan for {daysOfWeek[activeDay - 1]}
          </h2>
          {hasPlan && (
            <button 
              onClick={generateDayPlan}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold active:scale-95 transition-transform"
            >
              <RefreshCw size={14} /> Refresh Plan
            </button>
          )}
        </div>

        {!hasPlan ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 mt-10">
            <div className="w-20 h-20 bg-[var(--color-brand-cream)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-[var(--color-brand-orange)]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No meals planned</h3>
            <p className="text-gray-500 text-sm mb-6">Generate a delicious Nigerian meal plan for {daysOfWeek[activeDay - 1]}.</p>
            <button 
              onClick={generateDayPlan}
              className="w-full py-4 bg-[var(--color-brand-orange)] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
            >
              Generate Meal Plan
            </button>
          </div>
        ) : (
          (['breakfast', 'lunch', 'dinner'] as const).map(meal => {
            const recipe = getRecipe(currentPlan[meal]);
            
            return (
              <div key={meal} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">{meal}</h3>
                  <div className="flex items-center gap-2">
                    {currentPlan[meal] && (
                      <button 
                        onClick={() => {
                          const newRecipe = getRandomRecipe(meal, recipe ? recipe.id : null);
                          updateTimetable(activeDay, meal, newRecipe.id);
                        }}
                        className="text-gray-400 hover:text-[var(--color-brand-orange)] p-1.5 rounded-full active:scale-95 transition-all bg-gray-50"
                        title="Randomize this meal"
                      >
                        <RefreshCw size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => setEditingMeal(meal)}
                      className="text-[var(--color-brand-orange)] text-xs font-bold bg-[var(--color-brand-cream)] px-3 py-1 rounded-full active:scale-95 transition-transform"
                    >
                      {currentPlan[meal] ? "Change" : "Add Meal"}
                    </button>
                  </div>
                </div>
                
                {recipe ? (
                  <Link to={`/recipe/${recipe.id}`} className="flex gap-3 active:scale-[0.98] transition-transform">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img src={recipe.imageUrl || undefined} alt={recipe.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div className="pr-2">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">{recipe.name}</p>
                        
                      </div>
                      <ChevronRight className="text-gray-300 shrink-0" size={20} />
                    </div>
                  </Link>
                ) : currentPlan[meal] ? (
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      <span className="text-xl">🍽️</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div className="pr-2">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">{currentPlan[meal]}</p>
                        <p className="text-xs text-[var(--color-brand-orange)] font-medium">Custom Meal</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          updateTimetable(activeDay, meal, "");
                        }}
                        className="text-red-400 hover:text-red-500 p-2 rounded-full active:scale-95 transition-all bg-red-50 mr-2 shrink-0"
                        title="Remove custom meal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setEditingMeal(meal)}
                    className="h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-medium text-sm active:bg-gray-50"
                  >
                    Tap to set {meal}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Selection Modal */}
      {editingMeal && (
        <div className="absolute inset-0 z-50 bg-black/60 flex flex-col justify-end animate-in fade-in">
          <div className="bg-white w-full h-[85%] rounded-t-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
              <h3 className="font-bold text-lg capitalize">Select {editingMeal}</h3>
              <button onClick={() => setEditingMeal(null)} className="p-2 bg-gray-100 rounded-full active:scale-95">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-safe">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Or type a custom meal..."
                  value={customMealText}
                  onChange={(e) => setCustomMealText(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-brand-orange)]"
                />
                <button 
                  onClick={() => {
                    if (customMealText.trim()) {
                      handleSelectRecipe(customMealText.trim());
                      setCustomMealText('');
                    }
                  }}
                  className="px-4 py-2 bg-[var(--color-brand-orange)] text-white font-bold rounded-xl text-sm active:scale-95 transition-transform"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {recipeOptions.filter(r => r.name.toLowerCase().includes(customMealText.toLowerCase())).map(r => (
                  <button 
                    key={r.id}
                    onClick={() => {
                      handleSelectRecipe(r.id);
                      setCustomMealText('');
                    }}
                    className="w-full text-left flex items-center gap-3 p-2 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
                  >
                    <img src={r.imageUrl || undefined} className="w-14 h-14 rounded-lg object-cover shrink-0 bg-gray-200" />
                    <div>
                      <span className="font-bold text-gray-900 text-sm line-clamp-1">{r.name}</span>
                      <span className="text-xs text-[var(--color-brand-orange)]">{r.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
