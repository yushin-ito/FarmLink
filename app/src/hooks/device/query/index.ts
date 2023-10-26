import { useQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";

export type GetDeviceResponse = Awaited<ReturnType<typeof getDevice>>;

const getDevice = async (deviceId: string | undefined) => {
  if (!deviceId) {
    return;
  }

  const { data, error } = await supabase
    .from("device")
    .select("*")
    .eq("deviceId", deviceId)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const useQueryDevice = (deviceId: string | undefined) =>
  useQuery({
    queryKey: ["device", deviceId],
    queryFn: async () => await getDevice(deviceId),
  });
