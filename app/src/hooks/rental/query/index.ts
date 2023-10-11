import { useQuery } from "react-query";
import { supabase } from "../../../supabase";
import { Rental, User } from "../../../types";

export type GetRentalResponse = Awaited<ReturnType<typeof getRental>>;
export type GetRentalsResponse = Awaited<ReturnType<typeof getRentals>>;
export type GetUserRentalsResponse = Awaited<ReturnType<typeof getUserRentals>>;

const getRental = async (rentalId: number) => {
  const { data, error } = await supabase
    .from("rental")
    .select("*, user(*)")
    .eq("rentalId", rentalId)
    .returns<(Rental["Row"] & { user: User["Row"] })[]>();
  if (error) {
    throw error;
  }
  return data[0];
};

const getRentals = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("rental")
    .select("*")
    .or(`privated.eq.false, ownerId.eq.${userId}`);

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

export const useQueryRentals = (userId: string | undefined) =>
  useQuery({
    queryKey: "rental",
    queryFn: async () => await getRentals(userId),
  });

export const useQueryUserRentals = (ownerId: string | undefined) =>
  useQuery({
    queryKey: ["rental", ownerId],
    queryFn: async () => await getUserRentals(ownerId),
  });
