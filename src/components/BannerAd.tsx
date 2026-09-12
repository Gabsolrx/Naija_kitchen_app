import React, { useEffect } from 'react';
import { ADMOB_CONFIG, AdMobService } from '../lib/admob';
import { Capacitor } from '@capacitor/core';

export function BannerAd() {
  useEffect(() => {
    // If native, show the native ad
    if (Capacitor.isNativePlatform()) {
      AdMobService.showBanner();
    }
    
    // Hide banner on unmount
    return () => {
      if (Capacitor.isNativePlatform()) {
        AdMobService.hideBanner();
      }
    };
  }, []);

  // Only show the placeholder DOM if we are NOT on a native platform.
  // The native platform overlays the ad over the webview.
  if (Capacitor.isNativePlatform()) {
    return <div className="w-full shrink-0" style={{ height: '50px' }} />;
  }

  return (
    <div className="w-full bg-gray-100 border-t border-gray-200 flex flex-col items-center justify-center shrink-0" style={{ height: '50px' }}>
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Advertisement</span>
      <span className="text-[10px] text-gray-400">AdMob Banner ({ADMOB_CONFIG.BANNER_AD_UNIT_ID})</span>
    </div>
  );
}
