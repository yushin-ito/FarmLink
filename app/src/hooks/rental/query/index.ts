import { PostgrestError } from "@supabase/supabase-js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { LatLng } from "react-native-maps";

import { supabase } from "../../../supabase";
import { Rental, Scene, User } from "../../../types";
import useAuth from "../../auth/useAuth";

export type GetRentalResponse = Awaited<ReturnType<typeof getRental>>;
export type GetRentalsResponse = Awaited<ReturnType<typeof getRentals>>;
export type GetUserRentalsResponse = Awaited<ReturnType<typeof getUserRentals>>;

const getRental = async (rentalId: number) => {
  const { data, error } = await supabase
    .from("rental")
    .select("*, owner:user(*)")
    .eq("rentalId", rentalId)
    .returns<(Rental["Row"] & { owner: User["Row"] })[]>();

  if (error) {
    throw error;
  }
  return data[0];
};

const getRentals = async (
  scene: Scene,
  location: LatLng | undefined,
  from: number,
  to: number
) => {
  if (scene === "near" && location) {
    const { data, error } = await supabase
      .rpc("sort_by_location_rental", {
        lat: location.latitude,
        long: location.longitude,
      })
      .range(from, to)
      .returns<Rental["Row"][]>();

    if (error) {
      throw error;
    }
    return data;
  } else if (scene === "newest") {
    const { data, error } = await supabase
      .from("rental")
      .select("*")
      .order("updatedAt", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    return data;
  } else if (scene === "popular") {
    const { data, error } = await supabase
      .from("rental")
      .select("*")
      .order("like_count", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    return data;
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

export const useInfiniteQueryRentals = (scene: Scene, location?: LatLng) => {
  const PAGE_COUNT = 30;
  const { session } = useAuth();

  return useInfiniteQuery<GetRentalsResponse, PostgrestError>({
    queryKey: ["rental", scene, location, session?.user.id],
    queryFn: async ({ pageParam }) =>
      await getRentals(
        scene,
        location,
        Number(pageParam),
        Number(pageParam) + PAGE_COUNT - 1
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === PAGE_COUNT) {
        return pages.flat().length;
      }
      return undefined;
    },
    select: ({ pages, pageParams }) => ({
      pages: [
        pages
          .flat()
          .filter(
            (item) => !item.privated || item.ownerId === session?.user.id
          ),
      ],
      pageParams,
    }),
  });
};

export const useQueryUserRentals = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["rental", session?.user.id],
    queryFn: async () => await getUserRentals(session?.user.id),
  });
};
