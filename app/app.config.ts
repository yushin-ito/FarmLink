import "dotenv/config";
import { ConfigContext, ExpoConfig } from "@expo/config";

export type Extra = {
  eas: { projectId: string };
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  STRIPE_KEY_LIVE: string;
  STRIPE_KEY_TEST: string;
};

export interface ExtendedExpoConfig extends ExpoConfig {
  extra: Extra;
}

export default ({ config }: ConfigContext): ExtendedExpoConfig => ({
  ...config,
  name: "FarmLink",
  slug: "FarmLink",
  currentFullName: "@farmlink/FarmLink",
  originalFullName: "@farmlink/FarmLink",
  scheme: "farmlink",
  owner: "farmlink",
  version: "1.0.0",
  orientation: "portrait",
  privacy: "public",
  icon: "./assets/icon.png",
  jsEngine: "hermes",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  updates: {
    fallbackToCacheTimeout: 0,
    checkAutomatically: "ON_ERROR_RECOVERY",
    url: "https://u.expo.dev/df9e736c-f430-41d3-9968-20058477c49c",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  ios: {
    bundleIdentifier: "com.farmlink.app",
    entitlements: {
      "com.apple.developer.applesignin": ["Default"],
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAP_KEY_IOS,
    },
    splash: {
      backgroundColor: "#75a43b",
      image: "./assets/splash.png",
      resizeMode: "cover",
      dark: {
        backgroundColor: "#171717",
      },
    },
  },
  android: {
    package: "com.farmlink.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#75a43b",
    },
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "ACCESS_FINE_LOCATION",
      "WRITE_SETTINGS",
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAP_KEY_ANDROID,
      },
    },
    splash: {
      backgroundColor: "#75a43b",
      image: "./assets/splash.png",
      resizeMode: "cover",
      dark: {
        backgroundColor: "#171717",
      },
    },
  },
  plugins: [
    "expo-localization",
    "expo-image-picker",
    "expo-location",
    "expo-media-library",
    "expo-asset",
    "expo-secure-store",
    [
      "@stripe/stripe-react-native",
      {
        merchantIdentifier: "merchant.com.farmlink.app",
        enableGooglePay: true,
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "df9e736c-f430-41d3-9968-20058477c49c",
    },
    SUPABASE_URL: process.env.SUPABASE_URL as string,
    SUPABASE_KEY: process.env.SUPABASE_KEY as string,
    STRIPE_KEY_LIVE: process.env.STRIPE_KEY_LIVE as string,
    STRIPE_KEY_TEST: process.env.STRIPE_KEY_TEST as string,
  },
});
