import { useMutation } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import { Record, UseMutationResult } from "../../../types";

export type PostRecordResponse = Awaited<ReturnType<typeof postRecord>>;
export type UpdateRecordResponse = Awaited<ReturnType<typeof updateRecord>>;
export type DeleteRecordResponse = Awaited<ReturnType<typeof deleteRecord>>;

const postRecord = async (record: Record["Insert"]) => {
  const { data, error } = await supabase
    .from("record")
    .insert(record)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

const updateRecord = async (record: Record["Update"]) => {
  if (!record.recordId) {
    return;
  }

  const { data, error } = await supabase
    .from("record")
    .update(record)
    .eq("recordId", record.recordId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const deleteRecord = async (recordId: number) => {
  const { data, error } = await supabase
    .from("record")
    .delete()
    .eq("recordId", recordId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const usePostRecord = ({
  onSuccess,
  onError,
}: UseMutationResult<PostRecordResponse, Error>) =>
  useMutation({
    mutationFn: postRecord,
    onSuccess,
    onError,
  });

export const useUpdateRecord = ({
  onSuccess,
  onError,
}: UseMutationResult<UpdateRecordResponse, Error>) =>
  useMutation({
    mutationFn: updateRecord,
    onSuccess,
    onError,
  });

export const useDeleteRecord = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteRecordResponse, Error>) =>
  useMutation({
    mutationFn: deleteRecord,
    onSuccess,
    onError,
  });
