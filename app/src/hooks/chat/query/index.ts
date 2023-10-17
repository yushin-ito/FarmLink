import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";
import { useInfiniteQuery } from "react-query";
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
  const query = useInfiniteQuery<GetCommunityChatsResponse, PostgrestError>({
    queryKey: ["chat", communityId.toString()],
    queryFn: async ({ pageParam = 0 }) => {
      return await getCommunityChats(
        communityId,
        pageParam,
        pageParam + PAGE_COUNT - 1
      );
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.length === PAGE_COUNT) {
        return pages.map((page) => page).flat().length;
      }
    },
  });

  const data = useMemo(
    () =>
      query.data?.pages
        .flatMap((page) => page)
        .filter((page): page is NonNullable<typeof page> => page !== null),

    [query.data]
  );

  return { ...query, data };
};

export const useInfiniteQueryTalkChats = (talkId: number) => {
  const PAGE_COUNT = 15;
  const query = useInfiniteQuery<GetTalkChatsResponse, PostgrestError>({
    queryKey: ["chat", talkId.toString()],
    queryFn: async ({ pageParam = 0 }) => {
      return await getTalkChats(talkId, pageParam, pageParam + PAGE_COUNT - 1);
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.length === PAGE_COUNT) {
        return pages.map((page) => page).flat().length;
      }
    },
  });
  const data = useMemo(
    () =>
      query.data?.pages
        .flatMap((page) => page)
        .filter((page): page is NonNullable<typeof page> => page !== null),
    [query.data]
  );

  return { ...query, data };
};
