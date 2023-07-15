import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetFarmResponse = Awaited<ReturnType<typeof getFarm>>;
export type GetFarmsResponse = Awaited<ReturnType<typeof getFarms>>;
export type GetUserFarmsResponse = Awaited<ReturnType<typeof getUserFarms>>;

const getFarm = async (farmId: number | null) => {
  const { data, error } = await supabase
    .from("farm")
    .select("*")
    .eq("farmId", farmId);
  if (error) {
    throw error;
  }
  return data;
};

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
    .select("*, device(imageUrl)")
    .eq("ownerId", ownerId)
    .order("createdAt", { ascending: false });
  if (error) {
    throw error;
  }
  return data.map((item) =>
    Array.isArray(item.device)
      ? { ...item, imageUrl: item.device[0].imageUrl }
      : { ...item, imageUrl: item.device?.imageUrl }
  );
};

export const useQueryFarm = (farmId: number | null) =>
  useQuery({
    queryKey: ["farm", farmId],
    queryFn: async () => await getFarm(farmId),
  });

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
