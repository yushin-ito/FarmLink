import { decode } from "base64-arraybuffer";
import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Chat, UseMutationResult } from "../../../types/db";

export type PostChatResponse = Awaited<ReturnType<typeof postChat>>;
export type DeleteChatResponse = Awaited<ReturnType<typeof deleteChat>>;
export type PostCommunityChatImageResponse = Awaited<
  ReturnType<typeof postCommunityChatImage>
>;
export type PostTalkChatImageResponse = Awaited<
  ReturnType<typeof postTalkChatImage>
>;

const postChat = async (chat: Chat["Insert"]) => {
  const { data, error } = await supabase.from("chat").upsert(chat).select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteChat = async (chatId: number |null) => {
  const { data, error } = await supabase
    .from("chat")
    .delete()
    .eq("chatId", chatId);
  if (error) {
    throw error;
  }
  return data;
};

const postCommunityChatImage = async ({
  base64,
  size,
  communityId,
  authorId,
}: {
  base64: string;
  size: { width: number; height: number };
  communityId: number;
  authorId: string;
}) => {
  const filePath = `chat/${Math.random()}.png`;
  const { error } = await supabase.storage
    .from("image")
    .upload(filePath, decode(base64), {
      contentType: "image",
    });
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from("image").getPublicUrl(filePath);
  await postChat({
    communityId,
    authorId,
    imageUrl: data.publicUrl,
    width: size.width,
    height: size.height,
  });
};

const postTalkChatImage = async ({
  base64,
  size,
  talkId,
  authorId,
}: {
  base64: string;
  size: { width: number; height: number };
  talkId: number;
  authorId: string;
}) => {
  const filePath = `chat/${Math.random()}.png`;
  const { error } = await supabase.storage
    .from("image")
    .upload(filePath, decode(base64), {
      contentType: "image",
    });
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from("image").getPublicUrl(filePath);
  await postChat({
    talkId,
    authorId,
    imageUrl: data.publicUrl,
    width: size.width,
    height: size.height,
  });
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

export const usePostCommunityChatImage = ({
  onSuccess,
  onError,
}: UseMutationResult<PostCommunityChatImageResponse, Error>) =>
  useMutation({
    mutationFn: postCommunityChatImage,
    onSuccess,
    onError,
  });

export const usePostTalkChatImage = ({
  onSuccess,
  onError,
}: UseMutationResult<PostTalkChatImageResponse, Error>) =>
  useMutation({
    mutationFn: postTalkChatImage,
    onSuccess,
    onError,
  });
