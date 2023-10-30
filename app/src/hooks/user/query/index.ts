import { PostgrestError } from "@supabase/supabase-js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import useAuth from "../../auth/useAuth";

export type GetUserResponse = Awaited<ReturnType<typeof getUser>>;
export type GetUsersResponse = Awaited<ReturnType<typeof getUsers>>;

const getUser = async (userId: string | undefined) => {
  if (!userId) {
    return;
  }

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("userId", userId)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const getUsers = async (from: number, to: number) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .order("name")
    .range(from, to);

  if (error) {
    throw error;
  }
  return data;
};

export const useQueryUser = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["user", session?.user.id],
    queryFn: async () => await getUser(session?.user.id),
  });
};

export const useInfiniteQueryUsers = () => {
  const PAGE_COUNT = 10;
  const { session } = useAuth();

  return useInfiniteQuery<GetUsersResponse, PostgrestError>({
    queryKey: ["users", session?.user.id],
    queryFn: async ({ pageParam }) =>
      await getUsers(Number(pageParam), Number(pageParam) + PAGE_COUNT - 1),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === PAGE_COUNT) {
        return pages.flat().length;
      }
      return undefined;
    },
    select: ({ pages, pageParams }) => ({
      pages: [pages.flat().filter((item) => session?.user.id !== item.userId)],
      pageParams,
    }),
  });
};
