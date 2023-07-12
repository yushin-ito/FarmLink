import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetFarmLikeResponse = Awaited<ReturnType<typeof getFarmLike>>;
export type GetRentalLikeResponse = Awaited<ReturnType<typeof getRentalLike>>;

const getFarmLike = async (farmId: number) => {
  const { data, error } = await supabase
    .from("like")
    .select("*")
    .eq("farmId", farmId);
  if (error) {
    throw error;
  }

  return data;
};

export const useQueryFarmLike = (farmId: number) =>
  useQuery({
    queryKey: "like",
    queryFn: async () => await getFarmLike(farmId),
  });

const getRentalLike = async (rentalId: number) => {
  const { data, error } = await supabase
    .from("like")
    .select("*")
    .eq("rentalId", rentalId);
  if (error) {
    throw error;
  }

  return data;
};

export const useQueryRentalLike = (rentalId: number) =>
  useQuery({
    queryKey: "like",
    queryFn: async () => await getRentalLike(rentalId),
  });
