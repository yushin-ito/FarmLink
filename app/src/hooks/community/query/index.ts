import { supabase } from "../../../supabase";
import { useInfiniteQuery } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";

export type GetCommunitiesResponse = Awaited<ReturnType<typeof getCommunities>>;
export type GetCommunityChatsResponse = Awaited<
  ReturnType<typeof getCommunityChats>
>;

const getCommunities = async (from: number, to: number) => {
  const { data, error } = await supabase
    .from("community")
    .select("*")
    .order("createdAt", { ascending: false })
    .range(from, to);
  if (error) {
    throw error;
  }

  return data;
};

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

  return data.map((item) =>
    Array.isArray(item.user)
      ? { ...item, user: item.user[0] }
      : { ...item, user: item.user }
  );
};

export const useInfiniteQueryCommunities = () => {
  const PAGE_COUNT = 15;
  const query = useInfiniteQuery<GetCommunitiesResponse, PostgrestError>({
    queryKey: "communities",
    queryFn: async ({ pageParam = 0 }) => {
      return await getCommunities(pageParam, pageParam + PAGE_COUNT - 1);
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

export const useInfiniteQueryCommunityChats = (communityId: number) => {
  const PAGE_COUNT = 15;
  const query = useInfiniteQuery<GetCommunityChatsResponse, PostgrestError>({
    queryKey: communityId.toString(),
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
