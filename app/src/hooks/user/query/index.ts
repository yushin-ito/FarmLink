import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetUserResponse = Awaited<ReturnType<typeof getUser>>;

const getUser = async (userId: string | undefined) => {
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

export const useQueryUser = (userId: string | undefined) =>
  useQuery({
    queryKey: ["user", userId],
    queryFn: async () => await getUser(userId),
  });
