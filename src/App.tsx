/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Splash } from './pages/Splash';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { RecipeDetail } from './pages/RecipeDetail';
import { TimerScreen } from './pages/TimerScreen';
import { Favorites } from './pages/Favorites';
import { Timetable } from './pages/Timetable';
import { OfflinePack } from './pages/OfflinePack';
import { About } from './pages/About';
import { AdminApp } from './pages/admin/AdminApp';
import { useAppContext } from './context/AppContext';
import { BottomNav } from './components/BottomNav';
import { BannerAd } from './components/BannerAd';
import { WifiOff } from 'lucide-react';

export default function App() {
  const { isReady } = useAppContext();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isSplash = location.pathname === '/';

  if (!isReady && !isSplash) {
    return <div className="flex items-center justify-center w-full h-full bg-white"><div className="w-8 h-8 border-4 border-[var(--color-brand-orange)] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (isSplash) {
    return <Splash />;
  }

  // Hide BottomNav and BannerAd on certain screens if needed
  // But we want BannerAd almost everywhere.
  const hideBottomNav = location.pathname.startsWith('/recipe/') || location.pathname === '/search' || location.pathname.startsWith('/admin');

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-hidden relative mx-auto max-w-md shadow-2xl">
      {/* Global Offline Indicator */}
      {!isOnline && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-[10px] font-bold text-center py-0.5 flex items-center justify-center gap-1 z-[60]">
          <WifiOff size={10} /> You are offline. Showing cached content.
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/timer" element={<TimerScreen />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/offline" element={<OfflinePack />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </div>

      {/* Global Bottom Elements */}
      {!hideBottomNav && <BottomNav />}
      
      {/* Permanent AdMob Banner Placeholder at the bottom of the screen */}
      {!location.pathname.startsWith('/admin') && <BannerAd />}
    </div>
  );
}

