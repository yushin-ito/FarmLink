import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Farm, UseMutationResult } from "../../../types/db";

export type PostFarmResponse = Awaited<ReturnType<typeof postFarm>>;
export type DeleteFarmResponse = Awaited<ReturnType<typeof deleteFarm>>;
export type SearchFarmsResponse = Awaited<ReturnType<typeof searchFarms>>;

const postFarm = async (farm: Farm["Insert"]) => {
  const { data, error } = await supabase.from("farm").upsert(farm).select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteFarm = async (farmId: number) => {
  await supabase.from("like").delete().eq("farmId", farmId);
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
    .ilike("name", `%${text}%`);
  if (error) {
    throw error;
  }
  return data;
};

export const usePostFarm = ({
  onSuccess,
  onError,
}: UseMutationResult<PostFarmResponse, Error>) =>
  useMutation({
    mutationFn: postFarm,
    onSuccess,
    onError,
  });

export const useDeleteFarm = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteFarmResponse, Error>) =>
  useMutation({
    mutationFn: deleteFarm,
    onSuccess,
    onError,
  });

export const useSearchFarms = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchFarmsResponse, Error>) =>
  useMutation({
    mutationFn: searchFarms,
    onSuccess,
    onError,
  });
