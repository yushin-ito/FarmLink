import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { UseMutationResult } from "../../../types/db";

export type SearchDeviceResponse = Awaited<ReturnType<typeof searchDevice>>;

const searchDevice = async (text: string) => {
  const { data, error } = await supabase
    .from("device")
    .select()
    .textSearch("deviceId", `%${text}%`)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const useSearchDevice = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchDeviceResponse, PostgrestError>) =>
  useMutation({
    mutationFn: searchDevice,
    onSuccess,
    onError,
  });
