import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";
import { supabase } from "../../../supabase";
import { useInfiniteQuery, useQuery } from "react-query";
import { Talk, User } from "../../../types/db";

export type GetTalksResponse = Awaited<ReturnType<typeof getTalks>>;
export type GetTalkChatsResponse = Awaited<ReturnType<typeof getTalkChats>>;

const getTalks = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("talk")
    .select(`*, to:recieverId(*), from:senderId(*)`)
    .or(`senderId.eq.${userId},recieverId.eq.${userId}`)
    .order("createdAt", { ascending: false })
    .returns<(Talk["Row"] & { to: User["Row"]; from: User["Row"] })[]>();
  if (error) {
    throw error;
  }

  return data.map((item) => {
    if (item.recieverId === userId) {
      return { ...item, to: item.from, from: item.from };
    }
    return item;
  });
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

export const useQueryTalks = (userId: string | undefined) =>
  useQuery({
    queryKey: "talks",
    queryFn: async () => await getTalks(userId),
  });

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
