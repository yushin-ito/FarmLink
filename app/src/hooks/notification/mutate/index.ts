import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Notification, UseMutationResult } from "../../../types";

export type PostNotificationResponse = Awaited<
  ReturnType<typeof postNotification>
>;
export type DeleteNotificationResponse = Awaited<
  ReturnType<typeof deleteNotification>
>;

const postNotification = async (notification: Notification["Insert"]) => {
  const { data, error } = await supabase
    .from("notification")
    .upsert(notification)
    .select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteNotification = async (notificationId: number) => {
  await supabase.from("like").delete().eq("notificationId", notificationId);
  const { data, error } = await supabase
    .from("notification")
    .delete()
    .eq("notificationId", notificationId)
  if (error) {
    throw error;
  }
  return data;
};

export const usePostNotification = ({
  onSuccess,
  onError,
}: UseMutationResult<PostNotificationResponse, Error>) =>
  useMutation({
    mutationFn: postNotification,
    onSuccess,
    onError,
  });

export const useDeleteNotification = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteNotificationResponse, Error>) =>
  useMutation({
    mutationFn: deleteNotification,
    onSuccess,
    onError,
  });
