import { useQuery } from "react-query";
import { supabase } from "../../../supabase";
import { Farm, Like, Rental } from "../../../types";

export type GetUserLikesResponse = Awaited<ReturnType<typeof getUserLikes>>;
export type GetFarmLikesResponse = Awaited<ReturnType<typeof getFarmLikes>>;
export type GetRentalLikesResponse = Awaited<ReturnType<typeof getRentalLikes>>;

const getUserLikes = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("like")
    .select("*, farm(*, device(imageUrl)), rental(*)")
    .eq("userId", userId)
    .returns<
      (Like["Row"] & {
        farm: Farm["Row"] & { imageUrl: string | null };
        rental: Rental["Row"];
      })[]
    >();
  if (error) {
    throw error;
  }

  return data;
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
    queryKey: ["like", userId],
    queryFn: async () => await getUserLikes(userId),
  });

export const useQueryFarmLikes = (farmId: number) =>
  useQuery({
    queryKey: ["like", farmId],
    queryFn: async () => await getFarmLikes(farmId),
  });

export const useQueryRentalLikes = (rentalId: number) =>
  useQuery({
    queryKey: ["like", rentalId],
    queryFn: async () => await getRentalLikes(rentalId),
  });
