import { useInfiniteQuery, useQuery } from "react-query";
import { supabase } from "../../../supabase";
import { Device, Farm, User } from "../../../types";
import { PostgrestError } from "@supabase/supabase-js";
import { useMemo } from "react";
import { LatLng } from "react-native-maps";

export type GetFarmResponse = Awaited<ReturnType<typeof getFarm>>;
export type GetFarmsResponse = Awaited<ReturnType<typeof getFarms>>;
export type GetUserFarmsResponse = Awaited<ReturnType<typeof getUserFarms>>;

const getFarm = async (farmId: number) => {
  const { data, error } = await supabase
    .from("farm")
    .select("*, user(*), device(*)")
    .eq("farmId", farmId)
    .returns<(Farm["Row"] & { user: User["Row"]; device: Device["Row"] })[]>();

  if (error) {
    throw error;
  }
  return data[0];
};

const getFarms = async (
  userId: string | undefined,
  position: LatLng | undefined,
  from: number,
  to: number
) => {
  if (!position) {
    return [];
  }

  const { data, error } = await supabase
    .rpc("sort_by_location_farm", {
      lat: position.latitude,
      long: position.longitude,
    })
    .range(from, to)
    .returns<(Farm["Row"] & { device: Device["Row"] })[]>();
  if (error) {
    throw error;
  }

  return data.filter(
    (item) => item.privated === false || item.ownerId === userId
  );
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

export const useInfiniteQueryFarms = (
  userId: string | undefined,
  position: LatLng | undefined
) => {
  const PAGE_COUNT = 30;
  const query = useInfiniteQuery<GetFarmsResponse, PostgrestError>({
    queryKey: ["farm", userId, position],
    queryFn: async ({ pageParam = 0 }) =>
      await getFarms(userId, position, pageParam, pageParam + PAGE_COUNT - 1),
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

export const useQueryUserFarms = (ownerId: string | undefined) =>
  useQuery({
    queryKey: ["farm", ownerId],
    queryFn: async () => await getUserFarms(ownerId),
  });
