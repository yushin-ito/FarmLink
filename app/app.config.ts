import "dotenv/config";
import { ConfigContext, ExpoConfig } from "@expo/config";

export type Extra = {
  eas: { projectId: string };
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
};

export interface ExtendedExpoConfig extends ExpoConfig {
  extra: Extra;
}

export default ({ config }: ConfigContext): ExtendedExpoConfig => ({
  ...config,
  name: "farmlink",
  slug: "farmlink",
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
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.farmlink.app",
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY_IOS,
    },
    splash: {
      backgroundColor: "#ffffff",
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
        apiKey: process.env.GOOGLE_MAP_API_KEY_ANDROID,
      },
    },
    splash: {
      backgroundColor: "#ffffff",
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
  ],
  extra: {
    eas: {
      projectId: "d1f11309-5bb7-4e9b-ab8b-79cbdbbfd037",
    },
    SUPABASE_URL: process.env.SUPABASE_URL as string,
    SUPABASE_KEY: process.env.SUPABASE_KEY as string,
  },
});
