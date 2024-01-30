import { PostgrestError } from "@supabase/supabase-js";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";

import { supabase } from "../../../supabase";
import { Order } from "../../../types";

export type GetRecordResponse = Awaited<ReturnType<typeof getRecord>>;
export type GetRecordsResponse = Awaited<ReturnType<typeof getRecords>>;
export type GetAgendaResponse = Awaited<ReturnType<typeof getAgenda>>;

const getRecord = async (recordId: number) => {
  const { data, error } = await supabase
    .from("record")
    .select("*, farm(*)")
    .eq("recordId", recordId)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

const getRecords = async (
  order: Order,
  farmId: number,
  from: number,
  to: number
) => {
  if (order === "asc") {
    const { data, error } = await supabase
      .from("record")
      .select("*, farm(*)")
      .eq("farmId", farmId)
      .order("createdAt", { ascending: true })
      .range(from, to);

    if (error) {
      throw error;
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from("record")
      .select("*, farm(*)")
      .eq("farmId", farmId)
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    return data;
  }
};

const getAgenda = async (
  farmId: number[] | undefined,
  from: number,
  to: number
) => {
  if (!farmId) {
    return [];
  }

  const { data, error } = await supabase
    .from("record")
    .select("*, farm(*)")
    .filter("farmId", "in", `(${farmId.join(",")})`)
    .lte("createdAt", subDays(new Date(), from).toISOString())
    .gte("createdAt", subDays(new Date(), to).toISOString())
    .order("createdAt", { ascending: false });

  if (error) {
    throw error;
  }

  return [...Array(30)].map((_, index) => {
    const date = subDays(new Date(), index + from)
      .toISOString()
      .split("T")[0];
    const records = data.filter(
      (item) => new Date(item.createdAt).toISOString().split("T")[0] === date
    );
    return {
      title: date,
      data: [records.length ? records : null],
    };
  });
};

export const useQueryRecord = (recordId: number) =>
  useQuery({
    queryKey: ["record", recordId],
    queryFn: async () => await getRecord(recordId),
  });

export const useInfiniteQueryRecords = (order: Order, farmId: number) => {
  const PAGE_COUNT = 30;

  return useInfiniteQuery<GetRecordsResponse, PostgrestError>({
    queryKey: ["records", order, farmId],
    queryFn: async ({ pageParam }) =>
      await getRecords(
        order,
        farmId,
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
      pages: [pages.flat()],
      pageParams: pageParams,
    }),
  });
};

export const useInfiniteQueryAgenda = (farmId: number[] | undefined) => {
  const PAGE_COUNT = 30;

  return useInfiniteQuery<GetAgendaResponse, PostgrestError>({
    queryKey: ["agenda", farmId],
    queryFn: async ({ pageParam }) =>
      await getAgenda(
        farmId,
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
      pages: [pages.flat()],
      pageParams: pageParams,
    }),
  });
};
