import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { setWebInterstitialHandler, ADMOB_CONFIG } from '../lib/admob';
import { X, Sparkles, ExternalLink } from 'lucide-react';

export function WebInterstitialAd() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [dismissCallback, setDismissCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;

    setWebInterstitialHandler((onDismiss) => {
      setDismissCallback(() => onDismiss);
      setCountdown(2);
      setIsOpen(true);
    });

    return () => {
      setWebInterstitialHandler(null);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (dismissCallback) {
      dismissCallback();
      setDismissCallback(null);
    }
  };

  if (Capacitor.isNativePlatform() || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        {/* Ad Header */}
        <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-gray-950 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
              Ad
            </span>
            <span className="text-xs text-gray-300 font-medium">
              Google AdMob Interstitial
            </span>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors active:scale-95"
          >
            {countdown > 0 ? (
              <span>Skip in {countdown}s</span>
            ) : (
              <>
                <span>Close</span>
                <X size={14} />
              </>
            )}
          </button>
        </div>

        {/* Ad Media / Body */}
        <div className="relative h-44 bg-gradient-to-br from-amber-600 via-orange-500 to-red-600 p-6 flex flex-col justify-end text-white overflow-hidden">
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-amber-200">
            Unit: {ADMOB_CONFIG.INTERSTITIAL_AD_UNIT_ID.slice(-10)}
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold mb-2">
              <Sparkles size={12} className="text-amber-200" />
              <span>NaijaKitchen Featured Sponsor</span>
            </div>
            <h3 className="text-xl font-black leading-tight drop-shadow-sm">
              Authentic Nigerian Spices & Recipes
            </h3>
          </div>
        </div>

        {/* Ad Description & CTA */}
        <div className="p-5 flex flex-col gap-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Discover traditional ingredients, local cooking tips, and weekly timetables. Explore our collection of 100+ authentic African dishes.
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              Test Ad simulation <ExternalLink size={10} />
            </span>
            <button
              onClick={handleClose}
              className="px-5 py-2.5 bg-[var(--color-brand-orange)] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-transform"
            >
              Continue to Recipe &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
