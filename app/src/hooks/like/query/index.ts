import { useQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import { Device, Farm, Like, Rental } from "../../../types";
import useAuth from "../../auth/useAuth";

export type GetUserLikesResponse = Awaited<ReturnType<typeof getUserLikes>>;
export type GetFarmLikesResponse = Awaited<ReturnType<typeof getFarmLikes>>;
export type GetRentalLikesResponse = Awaited<ReturnType<typeof getRentalLikes>>;

const getUserLikes = async (userId: string | undefined) => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("like")
    .select("*, farm(*, device(*)), rental(*)")
    .eq("userId", userId)
    .returns<
      (Like["Row"] & {
        farm: Farm["Row"] & { device: Device["Row"] };
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

export const useQueryUserLikes = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["like", session?.user.id],
    queryFn: async () => await getUserLikes(session?.user.id),
  });
};

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
