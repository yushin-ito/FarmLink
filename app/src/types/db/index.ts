import { Database } from "./schema";

export type UseQueryResult<T1, T2> = {
  onSuccess?: (response: T1) => void;
  onError?: (error: T2) => void;
};

export type UseMutationResult<T1, T2> = {
  onSuccess?: (response: T1) => void;
  onError?: (error: T2) => void;
};

export type Community = Database["public"]["Tables"]["community"];
export type Farm = Database["public"]["Tables"]["farm"];
export type DM = Database["public"]["Tables"]["dm"];
export type Chat = Database["public"]["Tables"]["chat"];
export type User = Database["public"]["Tables"]["user"];