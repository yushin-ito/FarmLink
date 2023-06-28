import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Farm, UseMutationResult } from "../../../types/db";
import { PostgrestError } from "@supabase/supabase-js";

export type PostFarmResponse = Awaited<ReturnType<typeof postFarm>>;
export type DeleteFarmResponse = Awaited<
  ReturnType<typeof deleteFarm>
>;
export type SearchFarmssearchFarmsResponse = Awaited<
  ReturnType<typeof searchFarms>
>;

const postFarm = async (farm: Farm["Insert"]) => {
  const { data, error } = await supabase
    .from("farm")
    .upsert(farm)
    .select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteFarm = async (farmId: number) => {
  const { data, error } = await supabase
    .from("farm")
    .delete()
    .eq("farmId", farmId);
  if (error) {
    throw error;
  }
  return data;
};

const searchFarms = async (text: string) => {
  const { data, error } = await supabase
    .from("farm")
    .select()
    .ilike("farmName", `%${text}%`);
  if (error) {
    throw error;
  }
  return data;
};

export const usePostFarm = ({
  onSuccess,
  onError,
}: UseMutationResult<PostFarmResponse, PostgrestError>) =>
  useMutation({
    mutationFn: postFarm,
    onSuccess,
    onError,
  });

export const useDeleteFarm = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteFarmResponse, PostgrestError>) =>
  useMutation({
    mutationFn: deleteFarm,
    onSuccess,
    onError,
  });

export const useSearchFarms = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchFarmssearchFarmsResponse, PostgrestError>) =>
  useMutation({
    mutationFn: searchFarms,
    onSuccess,
    onError,
  });
