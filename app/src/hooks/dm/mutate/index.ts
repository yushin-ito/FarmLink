import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Chat, DM, UseMutationResult } from "../../../types/db";
import { PostgrestError } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

export type PostDMResponse = Awaited<ReturnType<typeof postDM>>;
export type DeleteDMResponse = Awaited<ReturnType<typeof deleteDM>>;
export type SearchDMsResponse = Awaited<ReturnType<typeof searchDMs>>;
export type PostDMChatResponse = Awaited<ReturnType<typeof postDMChat>>;
export type PostDMImageResponse = Awaited<ReturnType<typeof postDMImage>>;

const postDM = async (dm: DM["Insert"]) => {
  const { data, error } = await supabase.from("dm").upsert(dm).select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteDM = async (dmId: number) => {
  await supabase.from("chat").delete().eq("dmId", dmId);
  const { data, error } = await supabase.from("dm").delete().eq("dmId", dmId);
  if (error) {
    throw error;
  }
  return data;
};

const searchDMs = async (text: string) => {
  const { data, error } = await supabase
    .from("dm")
    .select()
    .ilike("dmName", `%${text}%`);
  if (error) {
    throw error;
  }
  return data;
};

const postDMChat = async (chat: Chat["Insert"]) => {
  const { data, error } = await supabase.from("chat").upsert(chat).select();
  if (error) {
    throw error;
  }
  return data;
};

const postDMImage = async ({
  base64,
  type,
  dmId,
  authorId,
}: {
  base64: string;
  type: string;
  dmId: number;
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
  await postDMChat({ dmId, authorId, imageUrl: data.publicUrl });
};

export const usePostDMImage = ({
  onSuccess,
  onError,
}: UseMutationResult<PostDMImageResponse, Error>) =>
  useMutation({
    mutationFn: postDMImage,
    onSuccess,
    onError,
  });

export const usePostDM = ({
  onSuccess,
  onError,
}: UseMutationResult<PostDMResponse, PostgrestError>) =>
  useMutation({
    mutationFn: postDM,
    onSuccess,
    onError,
  });

export const useDeleteDM = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteDMResponse, PostgrestError>) =>
  useMutation({
    mutationFn: deleteDM,
    onSuccess,
    onError,
  });

export const useSearchDMs = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchDMsResponse, PostgrestError>) =>
  useMutation({
    mutationFn: searchDMs,
    onSuccess,
    onError,
  });

export const usePostDMChat = ({
  onSuccess,
  onError,
}: UseMutationResult<PostDMChatResponse, PostgrestError>) =>
  useMutation({
    mutationFn: postDMChat,
    onSuccess,
    onError,
  });
