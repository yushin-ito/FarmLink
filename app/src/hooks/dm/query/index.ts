import { supabase } from "../../../supabase";
import { useInfiniteQuery } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";

export type GetDMsResponse = Awaited<ReturnType<typeof getDMs>>;
export type GetDMChatsResponse = Awaited<ReturnType<typeof getDMChats>>;

const getDMs = async (from: number, to: number) => {
  const { data, error } = await supabase
    .from("dm")
    .select("*")
    .order("createdAt", { ascending: false })
    .range(from, to);
  if (error) {
    throw error;
  }

  return data;
};

const getDMChats = async (dmId: number, from: number, to: number) => {
  const { data, error } = await supabase
    .from("chat")
    .select("*, user(*)")
    .eq("dmId", dmId)
    .order("createdAt", { ascending: false })
    .range(from, to);
  if (error) {
    throw error;
  }

  return data;
};

export const useInfiniteQueryDMs = () => {
  const PAGE_COUNT = 15;
  const query = useInfiniteQuery<GetDMsResponse, PostgrestError>({
    queryKey: "dms",
    queryFn: async ({ pageParam = 0 }) => {
      return await getDMs(pageParam, pageParam + PAGE_COUNT - 1);
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

export const useInfiniteQueryDMChats = (dmId: number) => {
  const PAGE_COUNT = 15;
  const query = useInfiniteQuery<GetDMChatsResponse, PostgrestError>({
    queryKey: dmId.toString(),
    queryFn: async ({ pageParam = 0 }) => {
      return await getDMChats(dmId, pageParam, pageParam + PAGE_COUNT - 1);
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
