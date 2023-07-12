import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Like, UseMutationResult } from "../../../types/db";

export type PostLikeResponse = Awaited<ReturnType<typeof postLike>>;
export type DeleteFarmLikeResponse = Awaited<ReturnType<typeof deleteFarmLike>>;
export type DeleteRentalLikeResponse = Awaited<
  ReturnType<typeof deleteRentalLike>
>;

const postLike = async (like: Like["Insert"]) => {
  const { data, error } = await supabase.from("like").upsert(like).select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteFarmLike = async (farmId: number) => {
  const { data, error } = await supabase
    .from("like")
    .delete()
    .eq("farmId", farmId);
  if (error) {
    throw error;
  }
  return data;
};

const deleteRentalLike = async (rentalId: number) => {
  const { data, error } = await supabase
    .from("like")
    .delete()
    .eq("rentalId", rentalId);
  if (error) {
    throw error;
  }
  return data;
};

export const usePostLike = ({
  onSuccess,
  onError,
}: UseMutationResult<PostLikeResponse, Error>) =>
  useMutation({
    mutationFn: postLike,
    onSuccess,
    onError,
  });

export const useDeleteFarmLike = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteFarmLikeResponse, Error>) =>
  useMutation({
    mutationFn: deleteFarmLike,
    onSuccess,
    onError,
  });

export const useDeleteRentalLike = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteRentalLikeResponse, Error>) =>
  useMutation({
    mutationFn: deleteRentalLike,
    onSuccess,
    onError,
  });
