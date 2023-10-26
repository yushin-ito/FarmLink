import { useMutation } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import { UseMutationResult } from "../../../types";

export type SearchDeviceResponse = Awaited<ReturnType<typeof searchDevice>>;

const searchDevice = async (query: string) => {
  const { data, error } = await supabase
    .from("device")
    .select()
    .textSearch("deviceId", `%${query}%`);

  if (error) {
    throw error;
  }
  return data;
};

export const useSearchDevice = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchDeviceResponse, Error>) =>
  useMutation({
    mutationFn: searchDevice,
    onSuccess,
    onError,
  });
