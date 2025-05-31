import { PostgrestError } from "@supabase/supabase-js";
import { useInfiniteQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";

export type GetCommunityChatsResponse = Awaited<
  ReturnType<typeof getCommunityChats>
>;
export type GetTalkChatsResponse = Awaited<ReturnType<typeof getTalkChats>>;

const getCommunityChats = async (
  communityId: number,
  from: number,
  to: number
) => {
  const { data, error } = await supabase
    .from("chat")
    .select("*, user(*)")
    .eq("communityId", communityId)
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }
  return data;
};

const getTalkChats = async (talkId: number, from: number, to: number) => {
  const { data, error } = await supabase
    .from("chat")
    .select("*, user(*)")
    .eq("talkId", talkId)
    .order("createdAt", { ascending: false })
    .range(from, to);
    
  if (error) {
    throw error;
  }
  return data;
};

export const useInfiniteQueryCommunityChats = (communityId: number) => {
  const PAGE_COUNT = 15;

  return useInfiniteQuery<GetCommunityChatsResponse, PostgrestError>({
    queryKey: ["chats", communityId],
    queryFn: async ({ pageParam }) => {
      return await getCommunityChats(
        communityId,
        Number(pageParam),
        Number(pageParam) + PAGE_COUNT - 1
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === PAGE_COUNT) {
        return pages.flat().length;
      }
      return undefined;
    },
    select: ({ pages, pageParams }) => ({
      pages: [pages.flat()],
      pageParams: pageParams,
    }),
  });
};

export const useInfiniteQueryTalkChats = (talkId: number) => {
  const PAGE_COUNT = 15;

  return useInfiniteQuery<GetTalkChatsResponse, PostgrestError>({
    queryKey: ["chats", talkId],
    queryFn: async ({ pageParam }) => {
      return await getTalkChats(
        talkId,
        Number(pageParam),
        Number(pageParam) + PAGE_COUNT - 1
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === PAGE_COUNT) {
        return pages.flat().length;
      }
      return undefined;
    },
    select: ({ pages, pageParams }) => ({
      pages: [pages.flat()],
      pageParams,
    }),
  });
};
