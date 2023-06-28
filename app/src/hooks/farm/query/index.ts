import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetFarmsResponse = Awaited<ReturnType<typeof getFarms>>;

const getFarms = async (ownerId: string | undefined) => {
  const { data, error } = await supabase
    .from("farm")
    .select("*")
    .eq("ownerId", ownerId)
    .order("createdAt", { ascending: false });
  if (error) {
    throw error;
  }

  return data;
};

export const useQueryFarms = (ownerId: string | undefined) =>
  useQuery({
    queryKey: "farms",
    queryFn: async () => await getFarms(ownerId),
  });
