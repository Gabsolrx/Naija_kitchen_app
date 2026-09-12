import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { TopBar } from '../../components/TopBar';
import { Plus, Edit2, Trash2, LogOut, Info , AlertTriangle } from 'lucide-react';

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { recipes, deleteRecipe } = useAppContext();
  const navigate = useNavigate();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteRecipe(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 shrink-0">
        <h1 className="font-bold text-lg text-gray-900">Dashboard</h1>
        <button onClick={onLogout} className="p-2 text-red-500 rounded-full hover:bg-red-50 active:bg-red-100 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Recipes ({recipes.length})</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/admin/about')}
              className="flex items-center gap-1 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform"
            >
              <Info size={16} /> Edit About
            </button>
            <button 
              onClick={() => navigate('/admin/new')}
              className="flex items-center gap-1 bg-[var(--color-brand-orange)] text-white px-3 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform"
            >
              <Plus size={16} /> New Recipe
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-3">
              <img 
                src={recipe.imageUrl || undefined} 
                alt={recipe.name} 
                className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-900 truncate">{recipe.name}</h3>
                <p className="text-xs text-gray-500">{recipe.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {confirmDeleteId === recipe.id ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-red-500 font-bold">Delete?</span>
                    <button 
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg"
                    >
                      No
                    </button>
                    <button 
                      onClick={() => handleDelete(recipe.id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg"
                    >
                      Yes
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate(`/admin/edit/${recipe.id}`)}
                      className="p-2 text-gray-600 bg-gray-100 rounded-full active:bg-gray-200 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => setConfirmDeleteId(recipe.id)}
                      className="p-2 text-red-500 bg-red-50 rounded-full active:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
