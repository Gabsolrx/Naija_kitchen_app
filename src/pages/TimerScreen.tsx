import React from 'react';
import { TopBar } from '../components/TopBar';
import { useAppContext } from '../context/AppContext';

import { formatTime, cn } from '../lib/utils';
import { Play, Pause, Square, Plus } from 'lucide-react';

export function TimerScreen() {
  const { recipes, timer, pauseTimer, resumeTimer, resetTimer, addTimerMinutes } = useAppContext();
  
  const recipe = timer.recipeId ? recipes.find(r => r && r.id === timer.recipeId) : null;
  
  // Calculate stroke dasharray for circular progress
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = timer.initialDuration > 0 
    ? ((timer.initialDuration - timer.timeLeft) / timer.initialDuration) * circumference 
    : 0;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <TopBar title="Cooking Timer" />
      
      <div className="flex-1 overflow-y-auto">        <div className="flex flex-col items-center justify-center min-h-full p-6 pb-12">
        
        {recipe && (
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold text-gray-500">Currently Cooking</h2>
            <h1 className="text-2xl font-bold text-gray-900">{recipe.name}</h1>
          </div>
        )}

        {/* Circular Timer Display */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Background circle */}
          <svg className="w-[240px] h-[240px] transform -rotate-90">
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-100"
            />
            {/* Progress circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              strokeLinecap="round"
              className={cn("transition-all duration-1000 ease-linear", timer.isActive ? "text-[var(--color-brand-orange)]" : "text-gray-300")}
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className={cn(
              "text-6xl font-bold tracking-tighter tabular-nums",
              timer.timeLeft === 0 && timer.initialDuration > 0 ? "text-red-500 animate-pulse" : "text-gray-900"
            )}>
              {formatTime(timer.timeLeft)}
            </span>
            {timer.timeLeft === 0 && timer.initialDuration > 0 && (
              <span className="text-red-500 font-bold mt-2 uppercase tracking-widest text-sm">Time Complete!</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <div className="flex justify-center gap-4">
            {timer.isActive ? (
              <button 
                onClick={pauseTimer}
                className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <Pause size={32} fill="currentColor" />
              </button>
            ) : (
              <button 
                onClick={resumeTimer}
                disabled={timer.timeLeft === 0}
                className="w-20 h-20 bg-[var(--color-brand-orange)] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:bg-gray-300"
              >
                <Play size={32} fill="currentColor" className="ml-1" />
              </button>
            )}
            
            <button 
              onClick={resetTimer}
              className="w-20 h-20 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <Square size={24} fill="currentColor" />
            </button>
          </div>
          
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => addTimerMinutes(1)}
              className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 active:bg-gray-100 flex items-center gap-1"
            >
              <Plus size={16} /> 1 Min
            </button>
            <button 
              onClick={() => addTimerMinutes(5)}
              className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 active:bg-gray-100 flex items-center gap-1"
            >
              <Plus size={16} /> 5 Min
            </button>
          </div>
        </div>      </div>

        
      </div>
    </div>
  );
}