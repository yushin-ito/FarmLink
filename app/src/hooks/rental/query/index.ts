import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetRentalsResponse = Awaited<ReturnType<typeof getRentals>>;

const getRentals = async (ownerId?: string) => {
  const { data, error } = ownerId
    ? await supabase
        .from("rental")
        .select("*")
        .eq("ownerId", ownerId)
        .order("createdAt", { ascending: false })
    : await supabase.from("rental").select("*");

  if (error) {
    throw error;
  }

  return data;
};

export const useQueryRentals = (ownerId?: string) =>
  useQuery({
    queryKey: "rental",
    queryFn: async () => await getRentals(ownerId),
  });
