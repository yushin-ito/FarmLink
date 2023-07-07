import { useQuery } from "react-query";
import { supabase } from "../../supabase";

export type GetDeviceResponse = Awaited<ReturnType<typeof getDevice>>;

const getDevice = async (deviceId: string | null | undefined) => {
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

export const useQueryDevice = (deviceId: string | null | undefined) =>
  useQuery({
    queryKey: "device",
    queryFn: async () => await getDevice(deviceId),
  });
