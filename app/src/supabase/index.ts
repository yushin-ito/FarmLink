import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "../types/schema";

export const supabaseUrl = Constants.manifest?.extra?.SUPABASE_URL;
export const supabaseKey = Constants.manifest?.extra?.SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
