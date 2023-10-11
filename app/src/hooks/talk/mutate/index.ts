import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Talk, UseMutationResult } from "../../../types";

export type PostTalkResponse = Awaited<ReturnType<typeof postTalk>>;
export type UpdateTalkResponse = Awaited<ReturnType<typeof updateTalk>>;
export type DeleteTalkResponse = Awaited<ReturnType<typeof deleteTalk>>;

const postTalk = async (talk: Talk["Insert"]) => {
  const { data, error } = await supabase.from("talk").insert(talk).select();
  if (error) {
    throw error;
  }
  return data;
};

const updateTalk = async (talk: Talk["Update"]) => {
  const { data, error } = await supabase
    .from("talk")
    .update(talk)
    .eq("talkId", talk.talkId)
    .select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteTalk = async (talkId: number) => {
  await supabase.from("notification").delete().eq("talkId", talkId);
  await supabase.from("chat").delete().eq("talkId", talkId);
  const { data, error } = await supabase
    .from("talk")
    .delete()
    .eq("talkId", talkId);
  if (error) {
    throw error;
  }
  return data;
};

export const usePostTalk = ({
  onSuccess,
  onError,
}: UseMutationResult<PostTalkResponse, Error>) =>
  useMutation({
    mutationFn: postTalk,
    onSuccess,
    onError,
  });

export const useUpdateTalk = ({
  onSuccess,
  onError,
}: UseMutationResult<UpdateTalkResponse, Error>) =>
  useMutation({
    mutationFn: updateTalk,
    onSuccess,
    onError,
  });

export const useDeleteTalk = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteTalkResponse, Error>) =>
  useMutation({
    mutationFn: deleteTalk,
    onSuccess,
    onError,
  });
