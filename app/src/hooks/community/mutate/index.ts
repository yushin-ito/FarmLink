import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Chat, Community, UseMutationResult } from "../../../types/db";
import { decode } from "base64-arraybuffer";

export type PostCommunityResponse = Awaited<ReturnType<typeof postCommunity>>;
export type DeleteCommunityResponse = Awaited<
  ReturnType<typeof deleteCommunity>
>;
export type SearchCommunitiesResponse = Awaited<
  ReturnType<typeof searchCommunities>
>;
export type PostCommunityChatResponse = Awaited<
  ReturnType<typeof postCommunityChat>
>;
export type PostCommunityChatImageResponse = Awaited<
  ReturnType<typeof postCommunityChatImage>
>;

const postCommunity = async (community: Community["Insert"]) => {
  const { data, error } = await supabase
    .from("community")
    .upsert(community)
    .select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteCommunity = async (communityId: number) => {
  await supabase.from("chat").delete().eq("communityId", communityId);
  const { data, error } = await supabase
    .from("community")
    .delete()
    .eq("communityId", communityId);
  if (error) {
    throw error;
  }
  return data;
};

const searchCommunities = async (text: string) => {
  const { data, error } = await supabase
    .from("community")
    .select()
    .ilike("name", `%${text}%`);
  if (error) {
    throw error;
  }
  return data;
};

const postCommunityChat = async (chat: Chat["Insert"]) => {
  const { data, error } = await supabase.from("chat").upsert(chat).select();
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
  await postCommunityChat({
    communityId,
    authorId,
    imageUrl: data.publicUrl,
    width: size.width,
    height: size.height,
  });
};

export const usePostCommunityChat = ({
  onSuccess,
  onError,
}: UseMutationResult<PostCommunityChatResponse, Error>) =>
  useMutation({
    mutationFn: postCommunityChat,
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

export const usePostCommunity = ({
  onSuccess,
  onError,
}: UseMutationResult<PostCommunityResponse, Error>) =>
  useMutation({
    mutationFn: postCommunity,
    onSuccess,
    onError,
  });

export const useDeleteCommunity = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteCommunityResponse, Error>) =>
  useMutation({
    mutationFn: deleteCommunity,
    onSuccess,
    onError,
  });

export const useSearchCommunities = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchCommunitiesResponse, Error>) =>
  useMutation({
    mutationFn: searchCommunities,
    onSuccess,
    onError,
  });
