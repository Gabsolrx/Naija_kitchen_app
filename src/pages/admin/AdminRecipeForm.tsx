import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Recipe } from '../../types';
import { ChevronLeft, Plus, Trash2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { compressImage } from '../../lib/imageUtils';

export function AdminRecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, addRecipe, updateRecipe } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(id);
  const existingRecipe = id ? recipes.find(r => r.id === id) : null;

  const [formData, setFormData] = useState<Partial<Recipe>>({
    name: '',
    category: 'Soup',
    description: '',
    imageUrl: '',
    preparationTime: 15,
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [''],
    instructions: ['']
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isSplit, setIsSplit] = useState(false);
  const [comp1IngName, setComp1IngName] = useState('Component 1');
  const [comp2IngName, setComp2IngName] = useState('Component 2');
  const [comp1InstName, setComp1InstName] = useState('Component 1');
  const [comp2InstName, setComp2InstName] = useState('Component 2');
  const [comp1Ing, setComp1Ing] = useState('');
  const [comp2Ing, setComp2Ing] = useState('');
  const [comp1Inst, setComp1Inst] = useState('');
  const [comp2Inst, setComp2Inst] = useState('');

  const parseGroups = (arr: string[]) => {
    let c1Name = '';
    let c1Items: string[] = [];
    let c2Name = '';
    let c2Items: string[] = [];
    
    let current = 0;
    for (const line of arr) {
      if (line.startsWith('## ')) {
        if (current === 0) {
          c1Name = line.replace('## ', '');
          current = 1;
        } else if (current === 1) {
          c2Name = line.replace('## ', '');
          current = 2;
        }
      } else {
        if (current === 1) c1Items.push(line);
        else if (current === 2) c2Items.push(line);
        else c1Items.push(line); 
      }
    }
    return { c1Name, c1Items, c2Name, c2Items };
  };


  useEffect(() => {
    if (isEdit && existingRecipe) {
      setFormData(existingRecipe);
      
      const isSplitIng = existingRecipe.ingredients?.some(i => i.startsWith('## '));
      const isSplitInst = existingRecipe.instructions?.some(i => i.startsWith('## '));
      
      if (isSplitIng || isSplitInst) {
        setIsSplit(true);
        const ingGroups = parseGroups(existingRecipe.ingredients || []);
        if (ingGroups.c1Name) setComp1IngName(ingGroups.c1Name);
        if (ingGroups.c2Name) setComp2IngName(ingGroups.c2Name);
        setComp1Ing(ingGroups.c1Items.join('\n'));
        setComp2Ing(ingGroups.c2Items.join('\n'));

        const instGroups = parseGroups(existingRecipe.instructions || []);
        if (instGroups.c1Name) setComp1InstName(instGroups.c1Name);
        if (instGroups.c2Name) setComp2InstName(instGroups.c2Name);
        setComp1Inst(instGroups.c1Items.join('\n'));
        setComp2Inst(instGroups.c2Items.join('\n'));
      }
    }
  }, [isEdit, existingRecipe]);

  const handleChange = (field: keyof Recipe, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    const newArr = [...(formData[field] || [])];
    newArr[index] = value;
    handleChange(field, newArr);
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    handleChange(field, [...(formData[field] || []), '']);
  };

  const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
    const newArr = [...(formData[field] || [])];
    newArr.splice(index, 1);
    handleChange(field, newArr);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Clear the input value so the user can select the same file again if they deleted it
    if (e.target) {
      e.target.value = '';
    }

    if (!file) {
      return;
    }
    try {
      setIsUploading(true);
      
      let tempUrl = '';
      try {
        tempUrl = URL.createObjectURL(file);
        handleChange('imageUrl', tempUrl);
      } catch (err) {
        console.warn("Could not create object URL", err);
      }

      try {
        const compressedBase64 = await compressImage(file, 800);
        handleChange('imageUrl', compressedBase64);
        setUploadSuccess(true);
      } catch (compressError: any) {
        console.error("Compression Error:", compressError);
        
        if (file.size <= 15 * 1024 * 1024) {
           const reader = new FileReader();
           reader.onloadend = () => {
             handleChange('imageUrl', reader.result as string);
             setUploadSuccess(true);
             alert("Note: Image was uploaded uncompressed.");
           };
           reader.readAsDataURL(file);
        } else {
           alert("Failed to compress image, and it's too large to upload raw. Error: " + (compressError.message || String(compressError)));
        }
      }
    } catch (error: any) {
      alert("Unexpected error: " + (error.message || String(error)));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalRecipe: Recipe = {
      ...(formData as Recipe),
      id: isEdit ? (formData.id as string) : `custom_${Date.now()}`,
    };

    if (isSplit) {
      finalRecipe.ingredients = [
        `## ${comp1IngName || 'Part 1'}`,
        ...comp1Ing.split('\n').filter(i => i.trim() !== ''),
        `## ${comp2IngName || 'Part 2'}`,
        ...comp2Ing.split('\n').filter(i => i.trim() !== '')
      ];
      finalRecipe.instructions = [
        `## ${comp1InstName || 'Part 1'}`,
        ...comp1Inst.split('\n').filter(i => i.trim() !== ''),
        `## ${comp2InstName || 'Part 2'}`,
        ...comp2Inst.split('\n').filter(i => i.trim() !== '')
      ];
    } else {
      finalRecipe.ingredients = (formData.ingredients || []).filter(i => i.trim() !== '');
      finalRecipe.instructions = (formData.instructions || []).filter(i => i.trim() !== '');
    }

    let success = false;
    if (isEdit) {
      success = await updateRecipe(finalRecipe);
    } else {
      success = await addRecipe(finalRecipe);
    }
    
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } else {
      // Don't navigate away if it failed to save!
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg text-gray-900">{isEdit ? 'Edit Recipe' : 'New Recipe'}</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 pb-32 flex flex-col gap-6 max-w-lg mx-auto">
          
          {/* Image Upload/Link */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Recipe Image</label>
            
            {/* Clickable Image Preview Box */}
            <label 
              htmlFor="recipeImageInput"
              className="w-full h-48 rounded-2xl overflow-hidden relative border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-gray-100"
            >
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChange('imageUrl', ''); setUploadSuccess(false); }} 
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm text-red-500 hover:bg-white"
                  >
                    <Trash2 size={16} />
                  </button>
                  {uploadSuccess && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                      <CheckCircle size={14} /> Uploaded Successfully
                    </div>
                  )}
                </>
              ) : (
                <>
                  <ImageIcon size={32} className="mb-2 text-gray-400 opacity-50" />
                  <span className="text-sm font-medium text-gray-500">Tap to select from Gallery</span>
                </>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <div className="w-6 h-6 border-2 border-[var(--color-brand-orange)] border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-sm font-bold text-[var(--color-brand-orange)]">Processing Image...</span>
                </div>
              )}
            </label>

            {/* Hidden File Input */}
            <input 
              id="recipeImageInput"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <input 
              type="url" 
              placeholder="Or paste Image URL instead"
              value={formData.imageUrl && formData.imageUrl.startsWith('http') ? formData.imageUrl : ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full mt-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Name</label>
            <input required type="text" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Category</label>
            <select value={formData.category || 'Soup'} onChange={e => handleChange('category', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl">
              {['Soup', 'Swallows', 'Rice', 'Stew', 'Quick Meals', 'Beans', 'Yam', 'Snacks', 'Drinks', 'Breakfast'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea required rows={3} value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
          </div>



          {/* Split Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-[var(--color-brand-orange)] rounded-xl mt-6">
            <div>
              <p className="font-bold text-gray-900 text-sm">Split Recipe into Two Parts?</p>
              <p className="text-xs text-gray-600 mt-0.5">Useful for combos like Akara and Pap</p>
            </div>
            <button
              type="button"
              onClick={() => setIsSplit(!isSplit)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isSplit ? 'bg-[var(--color-brand-orange)]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isSplit ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {isSplit ? (
            <div className="space-y-6 mt-4">
              {/* Ingredients Split */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Ingredients</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Part 1 Heading</label>
                  <input type="text" value={comp1IngName} onChange={e => setComp1IngName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="e.g. Akara" />
                  <textarea rows={4} value={comp1Ing} onChange={e => setComp1Ing(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm mt-2" placeholder="Beans\nSalt" />
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Part 2 Heading</label>
                  <input type="text" value={comp2IngName} onChange={e => setComp2IngName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="e.g. Pap" />
                  <textarea rows={4} value={comp2Ing} onChange={e => setComp2Ing(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm mt-2" placeholder="Corn\nSugar" />
                </div>
              </div>

              {/* Instructions Split */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                <h3 className="font-bold text-gray-900 border-b pb-2">Instructions</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Part 1 Heading</label>
                  <input type="text" value={comp1InstName} onChange={e => setComp1InstName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="e.g. How to make Akara" />
                  <textarea rows={4} value={comp1Inst} onChange={e => setComp1Inst(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm mt-2" placeholder="Wash beans\nBlend" />
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Part 2 Heading</label>
                  <input type="text" value={comp2InstName} onChange={e => setComp2InstName(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" placeholder="e.g. How to make Pap" />
                  <textarea rows={4} value={comp2Inst} onChange={e => setComp2Inst(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm mt-2" placeholder="Mix with water\nAdd hot water" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Normal Ingredients */}
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-bold text-gray-700">
                  Ingredients <span className="text-xs text-gray-400 font-normal">(Put each item on a new line)</span>
                </label>
                <textarea 
                  rows={5}
                  value={formData.ingredients?.join('\n') || ''}
                  onChange={e => handleChange('ingredients', e.target.value.split('\n'))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm leading-relaxed" 
                  placeholder="e.g.\n2 cups rice\n1 tsp salt" 
                />
              </div>

              {/* Normal Instructions */}
              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-bold text-gray-700">
                  Instructions <span className="text-xs text-gray-400 font-normal">(Put each step on a new line)</span>
                </label>
                <textarea 
                  rows={6}
                  value={formData.instructions?.join('\n') || ''}
                  onChange={e => handleChange('instructions', e.target.value.split('\n'))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm leading-relaxed" 
                  placeholder="e.g.\nBoil water in a pot.\nAdd the rice and reduce heat." 
                />
              </div>
            </>
          )}

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe flex justify-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50">
            <button type="submit" disabled={saveSuccess} className="w-full max-w-md py-4 bg-[var(--color-brand-orange)] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform disabled:opacity-50">
              {saveSuccess ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>
          
          {saveSuccess && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] animate-in fade-in">
              <div className="bg-white rounded-2xl p-6 flex flex-col items-center shadow-2xl animate-in zoom-in-95">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Saved Successfully!</h3>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
