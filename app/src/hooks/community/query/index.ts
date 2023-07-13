import { supabase } from "../../../supabase";
import { useInfiniteQuery } from "react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";

export type GetCommunitiesResponse = Awaited<ReturnType<typeof getCommunities>>;


const getCommunities = async (category: string, from: number, to: number) => {
  const { data, error } =
    category === "all"
      ? await supabase
          .from("community")
          .select("*")
          .order("createdAt", { ascending: false })
          .range(from, to)
      : await supabase
          .from("community")
          .select("*")
          .eq("category", category)
          .order("createdAt", { ascending: false })
          .range(from, to);
  if (error) {
    throw error;
  }

  return data;
};

export const useInfiniteQueryCommunities = (category: string) => {
  const PAGE_COUNT = 15;
  const query = useInfiniteQuery<GetCommunitiesResponse, PostgrestError>({
    queryKey: ["community", category],
    queryFn: async ({ pageParam = 0 }) => {
      return await getCommunities(
        category,
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

