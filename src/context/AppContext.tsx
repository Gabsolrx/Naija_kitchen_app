import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Timetable, Recipe, AboutContent } from '../types';
import localforage from 'localforage';

// Force IndexedDB as the primary driver for maximum storage capacity
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: 'NaijaKitchen',
  version: 1.0,
  storeName: 'recipes_data', // Should be alphanumeric, with underscores.
  description: 'Stores recipes and offline data'
});

import { supabase } from '../lib/supabase';

const DEFAULT_ABOUT: AboutContent = {
  title: 'NaijaKitchen',
  description: 'Your ultimate guide to authentic Nigerian cuisine. Discover, cook, and enjoy the best recipes from across the nation.',
  developerInfo: 'Developed with love for Nigerian food.',
  version: '1.0.0',
  contactEmail: 'naijakitchens2@gmail.com'
};

import { ALL_RECIPES } from '../data/recipes';

interface TimerState {
  isActive: boolean;
  timeLeft: number;
  recipeId: string | null;
  initialDuration: number;
}

interface AppContextType {


  aboutContent: AboutContent;
  updateAboutContent: (about: AboutContent) => Promise<void>;
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => Promise<boolean>;
  updateRecipe: (recipe: Recipe) => Promise<boolean>;
  deleteRecipe: (id: string) => Promise<void>;
  isReady: boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  offlinePack: string[];
  addOfflineRecipes: (ids: string[]) => void;
  removeOfflineRecipe: (id: string) => void;
  isOfflineAvailable: (id: string) => boolean;
  
  timetable: Timetable;
  updateTimetable: (day: number, meal: 'breakfast' | 'lunch' | 'dinner', recipeId: string) => void;
  
  timer: TimerState;
  startTimer: (recipeId: string, durationSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  addTimerMinutes: (minutes: number) => void;
}


const mapRecipeFromDB = (row: any): Recipe => ({
  id: row.id,
  name: row.name,
  category: row.category,
  description: row.description,
  imageUrl: row.image_url,
  ingredients: row.ingredients || [],
  instructions: row.instructions || [],
  preparationTime: row.preparation_time,
  cookingTime: row.cooking_time,
  totalTime: row.total_time,
  servings: row.servings,
  difficulty: row.difficulty,
  tags: row.tags || [],
  searchKeywords: row.search_keywords || [],
  timerDuration: row.timer_duration
});

const mapRecipeToDB = (recipe: Recipe) => ({
  id: recipe.id,
  name: recipe.name || 'Unnamed Recipe',
  category: recipe.category || 'Soups',
  description: recipe.description || '',
  image_url: recipe.imageUrl || '',
  ingredients: recipe.ingredients || [],
  instructions: recipe.instructions || [],
  preparation_time: recipe.preparationTime || 0,
  cooking_time: recipe.cookingTime || 0,
  total_time: recipe.totalTime || 0,
  servings: recipe.servings || 1,
  difficulty: recipe.difficulty || 'Medium',
  tags: recipe.tags || [],
  search_keywords: recipe.searchKeywords || [],
  timer_duration: recipe.timerDuration || 0
});

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {


  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        let { data: sbRecipes, error: recipeErr } = await supabase.from('recipes').select('*');
        if (recipeErr) {
            console.error("Supabase Read Error (Recipes):", recipeErr);
            if (recipeErr.code === '42501' || recipeErr.message?.toLowerCase().includes('row-level security')) {
                alert("Supabase Error: Row Level Security (RLS) is blocking READ access! Please disable RLS on the 'recipes' table in your Supabase dashboard.");
            } else {
                alert("Supabase Connection Error: " + recipeErr.message);
            }
        }

        let { data: sbAbout, error: aboutErr } = await supabase.from('about_content').select('*').eq('id', 1).single();
        if (aboutErr && aboutErr.code !== 'PGRST116') { // PGRST116 is just "no rows returned"
            console.error("Supabase Read Error (About):", aboutErr);
        }

        let finalRecipes = ALL_RECIPES;
        let finalAbout = DEFAULT_ABOUT;

        // Check if we need to initialize (if about content is also missing, assume fresh DB)
        const isFreshDb = sbRecipes && sbRecipes.length === 0 && !sbAbout;
        if (!recipeErr && isFreshDb) {
            console.log("Supabase empty, initializing with default recipes...");
            const { error: initErr } = await supabase.from('recipes').insert(ALL_RECIPES.map(mapRecipeToDB));
            if (initErr) {
                console.error("Failed to initialize recipes:", initErr);
                if (initErr.message.includes('row-level security') || initErr.code === '42501') {
                    alert("Supabase Error: Row Level Security (RLS) is blocking inserts! Please go to your Supabase Table Editor and disable RLS for the 'recipes' and 'about_content' tables, or add appropriate policies.");
                } else {
                    alert("Failed to initialize Supabase database: " + initErr.message);
                }
            }
            const newRecipesRes = await supabase.from('recipes').select('*');
            sbRecipes = newRecipesRes.data;
            
            if (!sbAbout) {
                const { error: aboutInitErr } = await supabase.from('about_content').insert({
                    id: 1,
                    title: DEFAULT_ABOUT.title,
                    description: DEFAULT_ABOUT.description,
                    developer_info: DEFAULT_ABOUT.developerInfo,
                    version: DEFAULT_ABOUT.version,
                    contact_email: DEFAULT_ABOUT.contactEmail
                });
                if (aboutInitErr) console.error('Failed to init about:', aboutInitErr);
                const newAboutRes = await supabase.from('about_content').select('*').eq('id', 1).single();
                sbAbout = newAboutRes.data;
            }
        }

        if (!recipeErr && sbRecipes) {
            if (!isFreshDb && sbRecipes.length === 0) {
                // If it's not a fresh DB but recipes are empty, it means user deleted all of them
                finalRecipes = [];
            } else {
                // Use only recipes from DB, do not resurrect deleted ALL_RECIPES
                finalRecipes = sbRecipes.map(mapRecipeFromDB);
            }
            await localforage.setItem('naijakitchen_recipes', finalRecipes);
        } else {
            const localR = await localforage.getItem<Recipe[]>('naijakitchen_recipes');
            if (localR) {
                finalRecipes = localR;
            } else {
                finalRecipes = ALL_RECIPES;
            }
            await localforage.setItem('naijakitchen_recipes', finalRecipes);
        }

        if (!aboutErr && sbAbout) {
            finalAbout = {
                title: sbAbout.title,
                description: sbAbout.description,
                developerInfo: sbAbout.developer_info,
                version: sbAbout.version,
                contactEmail: sbAbout.contact_email
            };
            await localforage.setItem('naijakitchen_about', finalAbout);
        } else {
            const localA = await localforage.getItem<AboutContent>('naijakitchen_about');
            if (localA) finalAbout = localA;
        }

        setRecipes(finalRecipes);
        setAboutContent(finalAbout);
        setIsReady(true);
      } catch (err) {
        console.error("Failed to load from Supabase:", err);
        const localR = await localforage.getItem<Recipe[]>('naijakitchen_recipes');
        if (localR && localR.length > 0) setRecipes(localR);
        else setRecipes(ALL_RECIPES);

        const localA = await localforage.getItem<AboutContent>('naijakitchen_about');
        if (localA) setAboutContent(localA);
        else setAboutContent(DEFAULT_ABOUT);
        
        setIsReady(true);
      }
    };
    fetchInitialData();
  }, []);

  const updateAboutContent = async (newAbout: AboutContent) => {
    setAboutContent(newAbout);
    await localforage.setItem('naijakitchen_about', newAbout);
    try {
        const { error } = await supabase.from('about_content').update({
            title: newAbout.title,
            description: newAbout.description,
            developer_info: newAbout.developerInfo,
            version: newAbout.version,
            contact_email: newAbout.contactEmail
        }).eq('id', 1);
        if (error) { console.error('Supabase update about error:', error); alert('Failed to save to database: ' + error.message); }
    } catch(e) { console.error('Supabase sync error:', e); }
  };

  const addRecipe = async (newRecipe: Recipe): Promise<boolean> => {
    try {
        console.log("Attempting to insert recipe into Supabase:", mapRecipeToDB(newRecipe));
        const { error } = await supabase.from('recipes').insert(mapRecipeToDB(newRecipe));
        if (error) { 
            console.error('Supabase insert recipe error:', error); 
            alert('Failed to save to database: ' + error.message); 
            return false;
        }
        
        // Only update local state if Supabase succeeds
        const next = [newRecipe, ...recipes];
        setRecipes(next);
        await localforage.setItem('naijakitchen_recipes', next);
        return true;
    } catch(e: any) { 
        console.error('Supabase sync error:', e); 
        alert('Network/Sync Error: ' + e.message);
        return false;
    }
  };

  const updateRecipe = async (updated: Recipe): Promise<boolean> => {
    try {
        const { error } = await supabase.from('recipes').update(mapRecipeToDB(updated)).eq('id', updated.id);
        if (error) { 
            console.error('Supabase update recipe error:', error); 
            alert('Supabase Error: ' + error.message); 
            return false;
        }
        
        // Only update local state if Supabase succeeds
        const next = recipes.map(r => r.id === updated.id ? updated : r);
        setRecipes(next);
        await localforage.setItem('naijakitchen_recipes', next);
        return true;
    } catch(e: any) { 
        console.error('Supabase sync error:', e); 
        alert('Network/Sync Error: ' + e.message);
        return false;
    }
  };

  const deleteRecipe = async (id: string) => {
    const next = recipes.filter(r => r.id !== id);
    setRecipes(next);
    await localforage.setItem('naijakitchen_recipes', next);
    try {
        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if (error) { console.error('Supabase delete recipe error:', error); alert('Failed to save to database: ' + error.message); }
    } catch(e) { console.error('Supabase sync error:', e); }
  }

  const [favorites, setFavorites] = useLocalStorage<string[]>('naijakitchen_favorites', []);
  const [offlinePack, setOfflinePack] = useLocalStorage<string[]>('naijakitchen_offline', []);
const DEFAULT_TIMETABLE: Timetable = {
  1: {
    "breakfast": "r1",
    "lunch": "r2",
    "dinner": "r3"
  },
  2: {
    "breakfast": "r4",
    "lunch": "r5",
    "dinner": "r6"
  },
  3: {
    "breakfast": "r7",
    "lunch": "r8",
    "dinner": "r9"
  },
  4: {
    "breakfast": "r10",
    "lunch": "r11",
    "dinner": "r12"
  },
  5: {
    "breakfast": "r13",
    "lunch": "r14",
    "dinner": "r15"
  },
  6: {
    "breakfast": "r16",
    "lunch": "r17",
    "dinner": "r18"
  },
  7: {
    "breakfast": "r19",
    "lunch": "r20",
    "dinner": "r21"
  }
};

  const [timetable, setTimetable] = useLocalStorage<Timetable>('naijakitchen_timetable', DEFAULT_TIMETABLE);
  const [timer, setTimer] = useLocalStorage<TimerState>('naijakitchen_timer', {
    isActive: false,
    timeLeft: 0,
    recipeId: null,
    initialDuration: 0,
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addOfflineRecipes = (ids: string[]) => {
    setOfflinePack(prev => {
      const newSet = new Set([...prev, ...ids]);
      return Array.from(newSet);
    });
  };

  const removeOfflineRecipe = (id: string) => {
    setOfflinePack(prev => prev.filter(item => item !== id));
  };

  const isOfflineAvailable = (id: string) => offlinePack.includes(id);

  const updateTimetable = (day: number, meal: 'breakfast' | 'lunch' | 'dinner', recipeId: string) => {
    setTimetable(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || { breakfast: null, lunch: null, dinner: null }),
        [meal]: recipeId
      }
    }));
  };

  useEffect(() => {
    if (Object.keys(timetable).length === 0) {
      setTimetable(DEFAULT_TIMETABLE);
    }
  }, [timetable, setTimetable]);

  // Timer Tick Logic
  useEffect(() => {
    let interval: number;
    if (timer.isActive && timer.timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(interval);
            // In a real Android app, we would fire a native notification here via Capacitor
            if (window.navigator.vibrate) {
              window.navigator.vibrate([500, 250, 500]);
            }
            return { ...prev, timeLeft: 0, isActive: false };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isActive, timer.timeLeft, setTimer]);

  const startTimer = (recipeId: string, durationSeconds: number) => {
    setTimer({
      isActive: true,
      timeLeft: durationSeconds,
      initialDuration: durationSeconds,
      recipeId,
    });
  };

  const pauseTimer = () => setTimer(prev => ({ ...prev, isActive: false }));
  const resumeTimer = () => setTimer(prev => ({ ...prev, isActive: true }));
  const resetTimer = () => setTimer(prev => ({ ...prev, isActive: false, timeLeft: prev.initialDuration }));
  const addTimerMinutes = (minutes: number) => setTimer(prev => ({ ...prev, timeLeft: prev.timeLeft + (minutes * 60) }));

  return (
    <AppContext.Provider value={{
      aboutContent, updateAboutContent, recipes, addRecipe, updateRecipe, deleteRecipe, isReady,
      favorites, toggleFavorite, isFavorite,
      offlinePack, addOfflineRecipes, removeOfflineRecipe, isOfflineAvailable,
      timetable, updateTimetable,
      timer, startTimer, pauseTimer, resumeTimer, resetTimer, addTimerMinutes
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
