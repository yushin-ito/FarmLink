import { decode } from "base64-arraybuffer";
import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Chat, UseMutationResult } from "../../../types";

export type PostChatResponse = Awaited<ReturnType<typeof postChat>>;
export type DeleteChatResponse = Awaited<ReturnType<typeof deleteChat>>;
export type PostChatImageResponse = Awaited<ReturnType<typeof postChatImage>>;

const postChat = async (chat: Chat["Insert"]) => {
  const { data, error } = await supabase
    .from("chat")
    .upsert(chat)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

const deleteChat = async (chatId: number | null) => {
  const { data, error } = await supabase
    .from("chat")
    .delete()
    .eq("chatId", chatId);
  if (error) {
    throw error;
  }
  return data;
};

const postChatImage = async (base64: string) => {
  const filePath = `chat/${Math.random()}.png`;
  const { data, error } = await supabase.storage
    .from("image")
    .upload(filePath, decode(base64), {
      contentType: "image",
    });
  if (error) {
    throw error;
  }

  return data;
};

export const usePostChat = ({
  onSuccess,
  onError,
}: UseMutationResult<PostChatResponse, Error>) =>
  useMutation({
    mutationFn: postChat,
    onSuccess,
    onError,
  });

export const useDeleteChat = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteChatResponse, Error>) =>
  useMutation({
    mutationFn: deleteChat,
    onSuccess,
    onError,
  });

export const usePostChatImage = ({
  onSuccess,
  onError,
}: UseMutationResult<PostChatImageResponse, Error>) =>
  useMutation({
    mutationFn: postChatImage,
    onSuccess,
    onError,
  });
