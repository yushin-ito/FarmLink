import { PostgrestError } from "@supabase/supabase-js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import { Category } from "../../../types";
import useAuth from "../../auth/useAuth";

export type GetCommunityResponse = Awaited<ReturnType<typeof getCommunity>>;
export type GetCommunitiesResponse = Awaited<ReturnType<typeof getCommunities>>;

const getCommunity = async (communityId: number) => {
  const { data, error } = await supabase
    .from("community")
    .select("*")
    .eq("communityId", communityId)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const getCommunities = async (
  category: Category,
  userId: string | undefined,
  from: number,
  to: number
) => {
  if (category === "all") {
    const { data, error } = await supabase
      .from("community")
      .select("*")
      .neq("ownerId", userId)
      .not("memberIds", "cs", `{"${userId}"}`)
      .order("updatedAt", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    return data;
  } else if (category === "joining") {
    const { data, error } = await supabase
      .from("community")
      .select("*")
      .or(`ownerId.eq.${userId}, memberIds.cs.{"${userId}"}`)
      .order("updatedAt", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from("community")
      .select("*")
      .eq("category", category)
      .neq("ownerId", userId)
      .not("memberIds", "cs", `{"${userId}"}`)
      .order("updatedAt", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    return data;
  }
};

export const useQueryCommuntiy = (communtiyId: number) =>
  useQuery({
    queryKey: ["communtiy", communtiyId],
    queryFn: async () => await getCommunity(communtiyId),
  });

export const useInfiniteQueryCommunities = (category: Category) => {
  const PAGE_COUNT = 15;
  const { session } = useAuth();

  return useInfiniteQuery<GetCommunitiesResponse, PostgrestError>({
    queryKey: ["communities", category, session?.user.id],
    queryFn: async ({ pageParam }) =>
      await getCommunities(
        category,
        session?.user.id,
        Number(pageParam),
        Number(pageParam) + PAGE_COUNT - 1
      ),
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
