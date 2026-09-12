import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { AboutContent } from '../../types';
import { ChevronLeft } from 'lucide-react';

export function AdminAboutForm() {
  const navigate = useNavigate();
  const { aboutContent, updateAboutContent } = useAppContext();

  const [formData, setFormData] = useState<AboutContent>(aboutContent);

  useEffect(() => {
    setFormData(aboutContent);
  }, [aboutContent]);

  const handleChange = (field: keyof AboutContent, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAboutContent(formData);
    navigate('/admin');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Edit About Page</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 pb-32 flex flex-col gap-6 max-w-lg mx-auto">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">App Title</label>
            <input required type="text" value={formData.title} onChange={e => handleChange('title', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Description / Mission</label>
            <textarea required rows={5} value={formData.description} onChange={e => handleChange('description', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Developer Info</label>
            <textarea required rows={3} value={formData.developerInfo} onChange={e => handleChange('developerInfo', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Version</label>
              <input required type="text" value={formData.version} onChange={e => handleChange('version', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Contact Email</label>
            <input required type="email" value={formData.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-safe flex justify-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <button type="submit" className="w-full max-w-md py-4 bg-[var(--color-brand-orange)] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
              Save About Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
