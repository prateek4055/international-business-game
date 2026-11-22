import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.business.internationalboardgame',
  appName: 'International Business',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
