import { supabase } from "../../../supabase";
import { useQuery } from "react-query";
import { Talk, User } from "../../../types"

export type GetTalksResponse = Awaited<ReturnType<typeof getTalks>>;

const getTalks = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("talk")
    .select(`*, to:recieverId(*), from:senderId(*)`)
    .or(`senderId.eq.${userId},recieverId.eq.${userId}`)
    .order("updatedAt", { ascending: false })
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

export const useQueryTalks = (userId: string | undefined) =>
  useQuery({
    queryKey: ["talk", userId],
    queryFn: async () => await getTalks(userId),
  });
