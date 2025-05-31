import { useQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";
import { Talk, User } from "../../../types";
import useAuth from "../../auth/useAuth";

export type GetTalkResponse = Awaited<ReturnType<typeof getTalk>>;
export type GetTalksResponse = Awaited<ReturnType<typeof getTalks>>;

const getTalk = async (talkId: number) => {
  const { data, error } = await supabase
    .from("talk")
    .select("*, to:recieverId(*), from:senderId(*)")
    .eq("talkId", talkId)
    .returns<
      (Talk["Row"] & {
        to: User["Row"];
        from: User["Row"];
      })[]
    >();

  if (error) {
    throw error;
  }
  return data[0];
};

const getTalks = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("talk")
    .select(`*, to:recieverId(*), from:senderId(*), chat(imageUrl, message)`)
    .or(`senderId.eq.${userId}, recieverId.eq.${userId}`)
    .order("updatedAt", { ascending: false })
    .returns<
      (Talk["Row"] & {
        to: User["Row"];
        from: User["Row"];
        chat: { imageUrl: string | null; message: string | null } | null;
      })[]
    >();

  if (error) {
    throw error;
  }
  return data;
};

export const useQueryTalk = (talkId: number) => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["talk", talkId.toString(), session?.user.id],
    queryFn: async () => await getTalk(talkId),
    select: (data) =>
      data.recieverId === session?.user.id
        ? { ...data, to: data.from, from: data.from }
        : data,
  });
};

export const useQueryTalks = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["talks", session?.user.id],
    queryFn: async () => await getTalks(session?.user.id),
    select: (data) =>
      data.map((item) =>
        item.recieverId === session?.user.id
          ? { ...item, to: item.from, from: item.from }
          : item
      ),
  });
};
