import { useQuery } from "react-query";
import { supabase } from "../../../supabase";

export type GetRentalResponse = Awaited<ReturnType<typeof getRental>>;
export type GetRentalsResponse = Awaited<ReturnType<typeof getRentals>>;
export type GetUserRentalsResponse = Awaited<ReturnType<typeof getUserRentals>>;

const getRental = async (rentalId: number) => {
  const { data, error } = await supabase
    .from("rental")
    .select("*, user(*)")
    .eq("rentalId", rentalId)
    .single();

  if (error) {
    throw error;
  }
  return Array.isArray(data.user)
    ? { ...data, user: data.user[0] }
    : { ...data, user: data.user };
};

const getRentals = async () => {
  const { data, error } = await supabase.from("rental").select("*");

  if (error) {
    throw error;
  }

  return data;
};

const getUserRentals = async (ownerId: string | undefined) => {
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

export const useQueryRental = (rentalId: number) =>
  useQuery({
    queryKey: ["rental", rentalId.toString()],
    queryFn: async () => await getRental(rentalId),
  });

export const useQueryRentals = () =>
  useQuery({
    queryKey: "rental",
    queryFn: async () => await getRentals(),
  });

export const useQueryUserRentals = (ownerId: string | undefined) =>
  useQuery({
    queryKey: ["rental", ownerId],
    queryFn: async () => await getUserRentals(ownerId),
  });
