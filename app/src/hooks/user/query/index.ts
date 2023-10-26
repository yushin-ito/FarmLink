import { useQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import useAuth from "../../auth/useAuth";

export type GetUserResponse = Awaited<ReturnType<typeof getUser>>;

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

export const useQueryUser = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["user", session?.user.id],
    queryFn: async () => await getUser(session?.user.id),
  });
};
