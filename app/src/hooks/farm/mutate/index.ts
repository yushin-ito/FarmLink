import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Farm, UseMutationResult } from "../../../types";

export type PostFarmResponse = Awaited<ReturnType<typeof postFarm>>;
export type UpdateFarmResponse = Awaited<ReturnType<typeof updateFarm>>;
export type DeleteFarmResponse = Awaited<ReturnType<typeof deleteFarm>>;
export type SearchFarmsResponse = Awaited<ReturnType<typeof searchFarms>>;

const postFarm = async (farm: Farm["Insert"]) => {
  const { data, error } = await supabase.from("farm").insert(farm).select();
  if (error) {
    throw error;
  }
  return data;
};

const updateFarm = async (farm: Farm["Update"]) => {
  if (!farm.farmId) {
    return;
  }

  const { data, error } = await supabase
    .from("farm")
    .update(farm)
    .eq("farmId", farm.farmId)
    .select();
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
    .select("*, device(imageUrl)")
    .ilike("name", `%${text}%`)
    .returns<(Farm["Row"] & { device: { imageUrl: string } })[]>();
  if (error) {
    throw error;
  }
  return data.map((item) => ({
    ...item,
    imageUrl: item.device.imageUrl,
  }));
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

export const useUpdateFarm = ({
  onSuccess,
  onError,
}: UseMutationResult<UpdateFarmResponse, Error>) =>
  useMutation({
    mutationFn: updateFarm,
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
