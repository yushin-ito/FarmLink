import { PostgrestError } from "@supabase/supabase-js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { LatLng } from "react-native-maps";

import { supabase } from "../../../supabase";
import { Device, Farm, User } from "../../../types";
import useAuth from "../../auth/useAuth";

export type GetFarmResponse = Awaited<ReturnType<typeof getFarm>>;
export type GetFarmsResponse = Awaited<ReturnType<typeof getFarms>>;
export type GetUserFarmsResponse = Awaited<ReturnType<typeof getUserFarms>>;

const getFarm = async (farmId: number) => {
  const { data, error } = await supabase
    .from("farm")
    .select("*, owner:user(*), device(*)")
    .eq("farmId", farmId)
    .returns<(Farm["Row"] & { owner: User["Row"]; device: Device["Row"] })[]>();

  if (error) {
    throw error;
  }
  return data[0];
};

const getFarms = async (
  location: LatLng | undefined,
  from: number,
  to: number
) => {
  if (!location) {
    return [];
  }

  const { data, error } = await supabase
    .rpc("sort_by_location_farm", {
      lat: location.latitude,
      long: location.longitude,
    })
    .range(from, to)
    .returns<
      (Farm["Row"] & { owner: { name: string }; device: Device["Row"] })[]
    >();

  if (error) {
    throw error;
  }
  return data;
};

const getUserFarms = async (ownerId: string | undefined) => {
  if (!ownerId) {
    return [];
  }

  const { data, error } = await supabase
    .from("farm")
    .select("*, device(*)")
    .eq("ownerId", ownerId)
    .order("createdAt", { ascending: false })
    .returns<(Farm["Row"] & { device: Device["Row"] })[]>();

  if (error) {
    throw error;
  }
  return data;
};

export const useQueryFarm = (farmId: number) =>
  useQuery({
    queryKey: ["farm", farmId],
    queryFn: async () => await getFarm(farmId),
  });

export const useInfiniteQueryFarms = (location?: LatLng) => {
  const PAGE_COUNT = 30;
  const { session } = useAuth();

  return useInfiniteQuery<GetFarmsResponse, PostgrestError>({
    queryKey: ["farm", location, session?.user.id],
    queryFn: async ({ pageParam }) =>
      await getFarms(
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

export const useQueryUserFarms = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["farm", session?.user.id],
    queryFn: async () => await getUserFarms(session?.user.id),
  });
};
