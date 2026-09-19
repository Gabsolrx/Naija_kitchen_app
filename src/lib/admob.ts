import { Capacitor } from '@capacitor/core';
import { AdMob, AdOptions, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';

export const ADMOB_CONFIG = {
  ADMOB_APP_ID: "ca-app-pub-3940256099942544~3347511713", // Test App ID
  BANNER_AD_UNIT_ID: "ca-app-pub-3940256099942544/6300978111", // Test Banner
  INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3940256099942544/1033173712", // Test Interstitial
  REWARDED_AD_UNIT_ID: "ca-app-pub-3940256099942544/5224354917", // Test Rewarded
};

// Initialize AdMob on app startup
export const initializeAdMob = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await AdMob.initialize({
        testingDevices: ['YOUR_TEST_DEVICE_ID_HERE'], 
        initializeForTesting: true, // Remove this in production
      });
      console.log('AdMob Initialized');
    } catch (e) {
      console.error('AdMob init error', e);
    }
  }
};

let interstitialCounter = 0;
const INTERSTITIAL_FREQUENCY = 3; // Show interstitial every 3 requests

export const AdMobService = {
  showBanner: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      const options: BannerAdOptions = {
        adId: ADMOB_CONFIG.BANNER_AD_UNIT_ID,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 58, // Bottom nav is 48px (h-12) + safe area padding
        isTesting: true // Remove in production
      };
      await AdMob.showBanner(options);
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
  
  showInterstitialWithCap: async (): Promise<boolean> => {
    interstitialCounter++;
    if (interstitialCounter % INTERSTITIAL_FREQUENCY !== 0) {
      console.log(`[AdMob] Skipping interstitial (${interstitialCounter}/${INTERSTITIAL_FREQUENCY})`);
      return false;
    }
    await AdMobService.showInterstitial();
    return true;
  },

  showInterstitial: async (): Promise<void> => {
    return new Promise(async (resolve) => {
      console.log(`[AdMob] Showing Interstitial`);
      if (Capacitor.isNativePlatform()) {
        try {
          const options: AdOptions = {
            adId: ADMOB_CONFIG.INTERSTITIAL_AD_UNIT_ID,
            isTesting: true // Remove in production
          };
          await AdMob.prepareInterstitial(options);
          await AdMob.showInterstitial();
          resolve(); 
        } catch (e) {
          console.error(e);
          resolve();
        }
      } else {
        setTimeout(() => {
          resolve();
        }, 300);
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
