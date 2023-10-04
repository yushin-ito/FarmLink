import { useQuery } from "react-query";
import { supabase } from "../../../supabase";
import { Chat, Device, Farm, Notification, Rental, User } from "../../../types";

export type GetNotificationsResponse = Awaited<
  ReturnType<typeof getNotifications>
>;

const getNotifications = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("notification")
    .select("*, farm(*, device(*)), rental(*), chat(*), from:senderId(*)")
    .eq("recieverId", userId)
    .order("createdAt", { ascending: false })
    .returns<
      (Notification["Row"] & {
        farm: Farm["Row"] & { device: Device["Row"] };
        rental: Rental["Row"];
        chat: Chat["Row"];
        from: User["Row"];
      })[]
    >();
  if (error) {
    throw error;
  }

  return data;
};

export const useQueryNotifications = (userId: string | undefined) =>
  useQuery({
    queryKey: "notification",
    queryFn: async () => await getNotifications(userId),
  });
