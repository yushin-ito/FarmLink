import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetFarmsResponse = Awaited<ReturnType<typeof getFarms>>;

const getFarms = async () => {
  const { data, error } = await supabase
    .from("farm")
    .select("*")
    .eq("privated", false);
  if (error) {
    throw error;
  }
  return data;
};

const getUserFarms = async (ownerId: string | undefined) => {
  const { data, error } = await supabase
    .from("farm")
    .select("*")
    .eq("ownerId", ownerId)
    .order("createdAt", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const useQueryFarms = () =>
  useQuery({
    queryKey: "farm",
    queryFn: async () => await getFarms(),
  });

export const useQueryUserFarms = (ownerId: string | undefined) =>
  useQuery({
    queryKey: ["farm", ownerId],
    queryFn: async () => await getUserFarms(ownerId),
  });
