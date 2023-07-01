import { supabase } from "../../../supabase";
import { useInfiniteQuery } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";

export type GetTalksResponse = Awaited<ReturnType<typeof getTalks>>;
export type GetTalkChatsResponse = Awaited<ReturnType<typeof getTalkChats>>;

const getTalks = async (from: number, to: number) => {
  const { data, error } = await supabase
    .from("talk")
    .select("*, user(*)")
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

  return data.map((item) =>
    Array.isArray(item.user)
      ? { ...item, user: item.user[0] }
      : { ...item, user: item.user }
  );
};

export const useInfiniteQueryTalks = () => {
  const PAGE_COUNT = 15;
  const query = useInfiniteQuery<GetTalksResponse, PostgrestError>({
    queryKey: "talks",
    queryFn: async ({ pageParam = 0 }) => {
      return await getTalks(pageParam, pageParam + PAGE_COUNT - 1);
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
    queryKey: talkId.toString(),
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
