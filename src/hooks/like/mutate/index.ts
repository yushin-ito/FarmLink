import { useMutation } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import { Like, UseMutationResult } from "../../../types";

export type PostFarmLikeResponse = Awaited<ReturnType<typeof postFarmLike>>;
export type PostRentalLikeResponse = Awaited<ReturnType<typeof postRentalLike>>;
export type DeleteFarmLikeResponse = Awaited<ReturnType<typeof deleteFarmLike>>;
export type DeleteRentalLikeResponse = Awaited<
  ReturnType<typeof deleteRentalLike>
>;

const postFarmLike = async (like: Like["Insert"]) => {
  if (!like.farmId) {
    throw Error();
  }

  const { data, error } = await supabase
    .from("like")
    .upsert(like)
    .eq("farmId", like.farmId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const postRentalLike = async (like: Like["Insert"]) => {
  if (!like.rentalId) {
    throw Error();
  }

  const { data, error } = await supabase
    .from("like")
    .upsert(like)
    .eq("rentalId", like.rentalId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const deleteFarmLike = async ({
  farmId,
  userId,
}: {
  farmId: number;
  userId: string | undefined;
}) => {
  if (!userId) {
    throw Error();
  }

  const { data, error } = await supabase
    .from("like")
    .delete()
    .eq("farmId", farmId)
    .eq("userId", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const deleteRentalLike = async ({
  rentalId,
  userId,
}: {
  rentalId: number;
  userId: string | undefined;
}) => {
  if (!userId) {
    throw Error();
  }

  const { data, error } = await supabase
    .from("like")
    .delete()
    .eq("rentalId", rentalId)
    .eq("userId", userId)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  return data;
};

export const usePostFarmLike = ({
  onSuccess,
  onError,
}: UseMutationResult<PostFarmLikeResponse, Error>) =>
  useMutation({
    mutationFn: postFarmLike,
    onSuccess,
    onError,
  });

export const usePostRentalLike = ({
  onSuccess,
  onError,
}: UseMutationResult<PostRentalLikeResponse, Error>) =>
  useMutation({
    mutationFn: postRentalLike,
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
