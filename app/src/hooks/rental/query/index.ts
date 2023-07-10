import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetRentalResponse = Awaited<ReturnType<typeof getRental>>;

const getRental = async (ownerId: string | undefined) => {
  const { data, error } = await supabase
    .from("rental")
    .select("*")
    .eq("ownerId", ownerId)
    .order("createdAt", { ascending: false });
  if (error) {
    throw error;
  }

  return data;
};

export const useQueryRental = (ownerId: string | undefined) =>
  useQuery({
    queryKey: "rental",
    queryFn: async () => await getRental(ownerId),
  });
