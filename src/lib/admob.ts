import { Capacitor } from '@capacitor/core';
import { AdMob, AdOptions, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents } from '@capacitor-community/admob';

export const ADMOB_CONFIG = {
  ADMOB_APP_ID: "ca-app-pub-3940256099942544~3347511713", // Test App ID
  BANNER_AD_UNIT_ID: "ca-app-pub-3940256099942544/6300978111", // Test Banner
  INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3940256099942544/1033173712", // Test Interstitial
  REWARDED_AD_UNIT_ID: "ca-app-pub-3940256099942544/5224354917", // Test Rewarded
};

type WebInterstitialHandler = (onDismiss: () => void) => void;
let webInterstitialHandler: WebInterstitialHandler | null = null;

export const setWebInterstitialHandler = (handler: WebInterstitialHandler | null) => {
  webInterstitialHandler = handler;
};

let isInterstitialPreparing = false;
let isInterstitialReady = false;

// Preload the next interstitial ad in background so it displays instantly when requested
export const prepareNextInterstitial = async () => {
  if (!Capacitor.isNativePlatform() || isInterstitialPreparing) return;
  try {
    isInterstitialPreparing = true;
    const options: AdOptions = {
      adId: ADMOB_CONFIG.INTERSTITIAL_AD_UNIT_ID,
      isTesting: true // Test interstitial ad
    };
    await AdMob.prepareInterstitial(options);
    isInterstitialReady = true;
    console.log('[AdMob] Interstitial preloaded and ready');
  } catch (e) {
    console.warn('[AdMob] Interstitial preload failed or waiting', e);
    isInterstitialReady = false;
  } finally {
    isInterstitialPreparing = false;
  }
};

// Initialize AdMob on app startup
export const initializeAdMob = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await AdMob.initialize({
        testingDevices: ['YOUR_TEST_DEVICE_ID_HERE'], 
        initializeForTesting: true, // Remove this in production
      });
      console.log('[AdMob] Initialized successfully');

      // Listen for dismissal of interstitial to immediately preload the next one
      try {
        await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
          console.log('[AdMob] Interstitial dismissed, preparing next ad');
          isInterstitialReady = false;
          prepareNextInterstitial();
        });

        await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
          console.warn('[AdMob] Interstitial failed to show, preparing next ad');
          isInterstitialReady = false;
          prepareNextInterstitial();
        });
      } catch (listenerErr) {
        console.warn('[AdMob] Could not attach listener', listenerErr);
      }

      // Preload initial interstitial ad
      prepareNextInterstitial();
    } catch (e) {
      console.error('AdMob init error', e);
    }
  }
};

const getStoredCounter = (): number => {
  try {
    const saved = sessionStorage.getItem('admob_interstitial_counter');
    return saved ? parseInt(saved, 10) || 0 : 0;
  } catch {
    return 0;
  }
};

let interstitialCounter = getStoredCounter();
const INTERSTITIAL_FREQUENCY = 3; // Show interstitial every 3 recipe navigations (3rd, 6th, 9th, etc.)

const incrementCounter = (): number => {
  interstitialCounter++;
  try {
    sessionStorage.setItem('admob_interstitial_counter', interstitialCounter.toString());
  } catch {}
  return interstitialCounter;
};

let currentBannerMargin: number | null = null;

export const AdMobService = {
  showBanner: async (margin: number = 58) => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      // If banner is already showing with the exact same margin, skip recreating
      if (currentBannerMargin === margin) {
        return;
      }

      // If a banner with a different margin is active, remove it first so the new margin takes effect
      if (currentBannerMargin !== null) {
        try {
          await AdMob.removeBanner();
        } catch (err) {
          console.warn('Could not remove previous banner', err);
        }
        currentBannerMargin = null;
      }

      const options: BannerAdOptions = {
        adId: ADMOB_CONFIG.BANNER_AD_UNIT_ID,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: margin,
        isTesting: true // Remove in production
      };
      await AdMob.showBanner(options);
      currentBannerMargin = margin;
    } catch (e) {
      console.error('Banner error', e);
    }
  },

  hideBanner: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await AdMob.hideBanner();
    } catch (e) {}
  },

  removeBanner: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await AdMob.removeBanner();
      currentBannerMargin = null;
    } catch (e) {}
  },
  
  // Rate-limited interstitial check (1 in 3) for general recipe browsing (Home, Search, Favorites, Timetable)
  showInterstitialWithCap: async (): Promise<boolean> => {
    const currentCount = incrementCounter();
    console.log(`[AdMob Rate-Limiter] Recipe navigation count: ${currentCount} (Frequency: every ${INTERSTITIAL_FREQUENCY})`);
    
    // Only show on 3rd, 6th, 9th, etc. navigation
    if (currentCount % INTERSTITIAL_FREQUENCY !== 0) {
      console.log(`[AdMob Rate-Limiter] Skipping ad (${currentCount}/${INTERSTITIAL_FREQUENCY}) - navigating directly to recipe`);
      return false;
    }
    
    console.log(`[AdMob Rate-Limiter] Cap reached (${currentCount})! Triggering Interstitial Ad...`);
    await AdMobService.showInterstitial();
    return true;
  },

  // Full 100% interstitial display (used every time Next Recipe is clicked)
  showInterstitial: async (): Promise<void> => {
    return new Promise(async (resolve) => {
      console.log(`[AdMob] Triggering Interstitial Ad`);
      if (Capacitor.isNativePlatform()) {
        try {
          const options: AdOptions = {
            adId: ADMOB_CONFIG.INTERSTITIAL_AD_UNIT_ID,
            isTesting: true
          };

          // If not preloaded yet, prepare it now
          if (!isInterstitialReady) {
            try {
              console.log('[AdMob] Ad not preloaded, preparing now...');
              await AdMob.prepareInterstitial(options);
              isInterstitialReady = true;
            } catch (prepErr) {
              console.warn('[AdMob] Prepare interstitial error', prepErr);
            }
          }

          // Show the interstitial ad
          await AdMob.showInterstitial();
          isInterstitialReady = false;
          // Trigger preload for the next ad
          prepareNextInterstitial();
          resolve(); 
        } catch (e) {
          console.error('[AdMob] Error showing interstitial ad', e);
          prepareNextInterstitial();
          resolve();
        }
      } else {
        // Web / Preview mode: trigger web simulator or fallback timer
        if (webInterstitialHandler) {
          webInterstitialHandler(() => {
            resolve();
          });
        } else {
          setTimeout(() => {
            resolve();
          }, 300);
        }
      }
    });
  },

  showRewarded: async (onProgress?: (progress: number) => void): Promise<boolean> => {
    return new Promise(async (resolve) => {
      console.log(`[AdMob] Showing Rewarded`);
      if (Capacitor.isNativePlatform()) { 
         try {
           const options = {
             adId: ADMOB_CONFIG.REWARDED_AD_UNIT_ID,
             isTesting: true // Remove in production
           };
           await AdMob.prepareRewardVideoAd(options);
           await AdMob.showRewardVideoAd();
           resolve(true); 
          } catch (e) {
           resolve(false);
         }
      } else {
        let time = 0;
        const interval = setInterval(() => {
          time += 1;
          if (onProgress) onProgress(time / 3);
          if (time >= 3) {
            clearInterval(interval);
            resolve(true);
          }
        }, 1000);
      }
    });
  }
};
