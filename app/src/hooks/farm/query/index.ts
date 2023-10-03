import { useQuery } from "react-query";
import { supabase } from "../../../supabase";
import { Device, Farm, User } from "../../../types";

export type GetFarmResponse = Awaited<ReturnType<typeof getFarm>>;
export type GetFarmsResponse = Awaited<ReturnType<typeof getFarms>>;
export type GetUserFarmsResponse = Awaited<ReturnType<typeof getUserFarms>>;

const getFarm = async (farmId: number) => {
  const { data, error } = await supabase
    .from("farm")
    .select("*, user(*), device(*)")
    .eq("farmId", farmId)
    .returns<(Farm["Row"] & { user: User["Row"]; device: Device["Row"] })[]>();

  if (error) {
    throw error;
  }
  return data[0];
};

const getFarms = async () => {
  const { data, error } = await supabase
    .from("farm")
    .select("*, device(*)")
    .returns<(Farm["Row"] & { device: Device["Row"] })[]>();
  if (error) {
    throw error;
  }
  return data;
};

const getUserFarms = async (ownerId: string | undefined) => {
  const { data, error } = await supabase
    .from("farm")
    .select("*, device(*)")
    .eq("ownerId", ownerId)
    .order("createdAt", { ascending: false })
    .returns<(Farm["Row"] & { device: Device["Row"] })[]>();
  if (error) {
    throw error;
  }
  return data;
};

export const useQueryFarm = (farmId: number) =>
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
