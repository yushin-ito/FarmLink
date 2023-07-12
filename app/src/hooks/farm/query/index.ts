import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetFarmsResponse = Awaited<ReturnType<typeof getFarms>>;

const getFarms = async (ownerId?: string | null) => {
  const { data, error } = ownerId !== null
    ? await supabase
        .from("farm")
        .select("*")
        .eq("ownerId", ownerId)
        .order("createdAt", { ascending: false })
    : await supabase.from("farm").select("*").eq("privated", false);
  if (error) {
    throw error;
  }

  return data;
};

export const useQueryFarms = (ownerId?: string | null) =>
  useQuery({
    queryKey: "farms",
    queryFn: async () => await getFarms(ownerId),
  });
