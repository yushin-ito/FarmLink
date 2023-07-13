import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetUserLikesResponse = Awaited<ReturnType<typeof getUserLikes>>;
export type GetFarmLikesResponse = Awaited<ReturnType<typeof getFarmLikes>>;
export type GetRentalLikesResponse = Awaited<ReturnType<typeof getRentalLikes>>;

const getUserLikes = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("like")
    .select("*, farm(*), rental(*)")
    .eq("userId", userId);
  if (error) {
    throw error;
  }

  return data
    .map((item) =>
      Array.isArray(item.farm)
        ? { ...item, farm: item.farm[0] }
        : { ...item, farm: item.farm, }
    )
    .map((item) =>
      Array.isArray(item.rental)
        ? { ...item, rental: item.rental[0] }
        : { ...item, rental: item.rental }
    );
};

const getFarmLikes = async (farmId: number) => {
  const { data, error } = await supabase
    .from("like")
    .select("*")
    .eq("farmId", farmId);
  if (error) {
    throw error;
  }

  return data;
};

const getRentalLikes = async (rentalId: number) => {
  const { data, error } = await supabase
    .from("like")
    .select("*")
    .eq("rentalId", rentalId);
  if (error) {
    throw error;
  }

  return data;
};

export const useQueryUserLikes = (userId: string | undefined) =>
  useQuery({
    queryKey: "likes",
    queryFn: async () => await getUserLikes(userId),
  });

export const useQueryFarmLikes = (farmId: number) =>
  useQuery({
    queryKey: "likes",
    queryFn: async () => await getFarmLikes(farmId),
  });

export const useQueryRentalLikes = (rentalId: number) =>
  useQuery({
    queryKey: "likes",
    queryFn: async () => await getRentalLikes(rentalId),
  });
