import { useQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import { Device, Farm, Notification, Rental, User } from "../../../types";
import useAuth from "../../auth/useAuth";

export type GetNotificationsResponse = Awaited<
  ReturnType<typeof getNotifications>
>;

const getNotifications = async (userId: string | undefined) => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("notification")
    .select("*, farm(*, device(*)), rental(*), from:senderId(*)")
    .eq("recieverId", userId)
    .order("createdAt", { ascending: false })
    .returns<
      (Notification["Row"] & {
        farm: Farm["Row"] & { device: Device["Row"] };
        rental: Rental["Row"];
        from: User["Row"];
      })[]
    >();

  if (error) {
    throw error;
  }
  return data;
};

export const useQueryNotifications = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["notifications", session?.user.id],
    queryFn: async () => await getNotifications(session?.user.id),
  });
};
