import React, { useState } from 'react';
import { TopBar } from '../../components/TopBar';
import { Lock } from 'lucide-react';

export function AdminLogin({ onLogin }: { onLogin: (password: string) => boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden h-full">
      <TopBar title="Admin Access" showBack />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div className="w-20 h-20 bg-[var(--color-brand-cream)] rounded-full flex items-center justify-center mb-6">
          <Lock size={32} className="text-[var(--color-brand-orange)]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Area</h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          Enter the admin password to edit recipes.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
          <div>
            <input 
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)] transition-shadow select-auto touch-auto pointer-events-auto relative z-50"
            />
            {error && <p className="text-red-500 text-xs mt-1 pl-1">Incorrect password</p>}
          </div>
          <button 
            type="submit"
            className="w-full py-3.5 bg-[var(--color-brand-orange)] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
