import { useInfiniteQuery, useQuery } from "react-query";
import { supabase } from "../../../supabase";
import { Rental, Scene, User } from "../../../types";
import { LatLng } from "react-native-maps";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";

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

const getRentals = async (
  scene: Scene,
  from: number,
  to: number,
  userId: string | undefined,
  position?: LatLng
) => {
  if (scene === "near" && position) {
    const { data, error } = await supabase
      .rpc("sort_by_location_rental", {
        lat: position.latitude,
        long: position.longitude,
      })
      .range(from, to)
      .returns<Rental["Row"][]>();
    if (error) {
      throw error;
    }

    return data.filter((item) => !item.privated || item.ownerId === userId);
  } else if (scene === "newest") {
    const { data, error } = await supabase
      .from("rental")
      .select("*")
      .order("updatedAt", { ascending: false })
      .range(from, to);
    if (error) {
      throw error;
    }

    return data.filter((item) => !item.privated || item.ownerId === userId);
  } else if (scene === "popular") {
    const { data, error } = await supabase
      .from("rental")
      .select("*")
      .order("like_count", { ascending: false })
      .range(from, to);
    if (error) {
      throw error;
    }

    return data.filter((item) => !item.privated || item.ownerId === userId);
  } else {
    return [];
  }
};

const getUserRentals = async (ownerId: string | undefined) => {
  if (!ownerId) {
    return [];
  }

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

export const useInfiniteQueryRentals = (
  scene: Scene,
  userId: string | undefined,
  position?: LatLng
) => {
  const PAGE_COUNT = 30;
  const query = useInfiniteQuery<GetRentalsResponse, PostgrestError>({
    queryKey: ["rental", scene, userId, position],
    queryFn: async ({ pageParam = 0 }) =>
      await getRentals(
        scene,
        pageParam,
        pageParam + PAGE_COUNT - 1,
        userId,
        position
      ),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.length === PAGE_COUNT) {
        return pages.map((page) => page).flat().length;
      }
    },
  });

  const data = useMemo(
    () =>
      query.data?.pages
        .flatMap((page) => page)
        .filter((page): page is NonNullable<typeof page> => page !== null),
    [query.data]
  );

  return { ...query, data };
};

export const useQueryUserRentals = (ownerId: string | undefined) =>
  useQuery({
    queryKey: ["rental", ownerId],
    queryFn: async () => await getUserRentals(ownerId),
  });
