import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Chat, Talk, UseMutationResult } from "../../../types/db";
import { PostgrestError } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

export type PostTalkResponse = Awaited<ReturnType<typeof postTalk>>;
export type DeleteTalkResponse = Awaited<ReturnType<typeof deleteTalk>>;
export type PostTalkChatResponse = Awaited<ReturnType<typeof postTalkChat>>;
export type PostTalkImageResponse = Awaited<ReturnType<typeof postTalkImage>>;

const postTalk = async (talk: Talk["Insert"]) => {
  const { data, error } = await supabase.from("talk").upsert(talk).select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteTalk = async (talkId: number) => {
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

const postTalkChat = async (chat: Chat["Insert"]) => {
  const { data, error } = await supabase.from("chat").upsert(chat).select();
  if (error) {
    throw error;
  }
  return data;
};

const postTalkImage = async ({
  base64,
  type,
  talkId,
  authorId,
}: {
  base64: string;
  type: string;
  talkId: number;
  authorId: string;
}) => {
  const filePath = `chat/${Math.random()}.png`;
  const { error } = await supabase.storage
    .from("image")
    .upload(filePath, decode(base64), {
      contentType: type,
    });
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from("image").getPublicUrl(filePath);
  await postTalkChat({ talkId, authorId, imageUrl: data.publicUrl });
};

export const usePostTalkImage = ({
  onSuccess,
  onError,
}: UseMutationResult<PostTalkImageResponse, Error>) =>
  useMutation({
    mutationFn: postTalkImage,
    onSuccess,
    onError,
  });

export const usePostTalk = ({
  onSuccess,
  onError,
}: UseMutationResult<PostTalkResponse, PostgrestError>) =>
  useMutation({
    mutationFn: postTalk,
    onSuccess,
    onError,
  });

export const useDeleteTalk = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteTalkResponse, PostgrestError>) =>
  useMutation({
    mutationFn: deleteTalk,
    onSuccess,
    onError,
  });

export const usePostTalkChat = ({
  onSuccess,
  onError,
}: UseMutationResult<PostTalkChatResponse, PostgrestError>) =>
  useMutation({
    mutationFn: postTalkChat,
    onSuccess,
    onError,
  });
