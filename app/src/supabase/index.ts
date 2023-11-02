import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

import { Database } from "../types/schema";

export const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
export const supabaseKey = Constants.expoConfig?.extra?.SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
