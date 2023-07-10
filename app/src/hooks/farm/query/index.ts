import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetFarmsResponse = Awaited<ReturnType<typeof getFarms>>;

const getFarms = async (ownerId?: string) => {
  const { data, error } = ownerId
    ? await supabase
        .from("farm")
        .select("*")
        .eq("ownerId", ownerId)
        .order("createdAt", { ascending: false })
    : await supabase.from("farm").select("*");
  if (error) {
    throw error;
  }

  return data;
};

export const useQueryFarms = (ownerId?: string) =>
  useQuery({
    queryKey: "farms",
    queryFn: async () => await getFarms(ownerId),
  });
