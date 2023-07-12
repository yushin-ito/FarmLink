import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetRentalResponse = Awaited<ReturnType<typeof getRental>>;
export type GetRentalsResponse = Awaited<ReturnType<typeof getRentals>>;

const getRental = async (rentalId: number) => {
  const { data, error } = await supabase
    .from("rental")
    .select("*")
    .eq("rentalId", rentalId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const getRentals = async (ownerId?: string | null) => {
  const { data, error } =
    ownerId !== null
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

export const useQueryRental = (rentalId: number) =>
  useQuery({
    queryKey: "rental",
    queryFn: async () => await getRental(rentalId),
  });

export const useQueryRentals = (ownerId?: string | null) =>
  useQuery({
    queryKey: "rentals",
    queryFn: async () => await getRentals(ownerId),
  });
