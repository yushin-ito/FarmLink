import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "../types/db/schema";

export const supabaseUrl = Constants.manifest?.extra?.supabaseUrl;
export const supabaseKey = Constants.manifest?.extra?.supabaseKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
