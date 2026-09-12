import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.naijakitchen.app',
  appName: 'NaijaKitchen',
  webDir: 'dist',
  plugins: {
    AdMob: {
      // These are required to be added in AndroidManifest.xml as well
    }
  }
};

export default config;
