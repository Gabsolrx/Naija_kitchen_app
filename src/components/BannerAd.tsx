import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ADMOB_CONFIG, AdMobService } from '../lib/admob';
import { Capacitor } from '@capacitor/core';

interface BannerAdProps {
  isRecipePage?: boolean;
}

export function BannerAd({ isRecipePage }: BannerAdProps) {
  const location = useLocation();
  const onRecipe = isRecipePage ?? location.pathname.startsWith('/recipe/');
  const targetMargin = onRecipe ? 0 : 58;

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      AdMobService.showBanner(targetMargin);
    }
  }, [targetMargin]);

  // Only show the placeholder DOM if we are NOT on a native platform.
  // The native platform overlays the ad over the webview, so we return an empty spacer
  if (Capacitor.isNativePlatform()) {
    return <div className="w-full shrink-0" style={{ height: '56px' }} />;
  }

  return (
    <div className="w-full bg-gray-100 border-t border-gray-200 flex flex-col items-center justify-center shrink-0" style={{ height: '56px' }}>
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Advertisement</span>
      <span className="text-[10px] text-gray-400">AdMob Banner ({ADMOB_CONFIG.BANNER_AD_UNIT_ID})</span>
    </div>
  );
}
