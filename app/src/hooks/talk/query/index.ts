import { supabase } from "../../../supabase";
import { useQuery } from "react-query";
import { Talk, User } from "../../../types";

export type GetTalkResponse = Awaited<ReturnType<typeof getTalk>>;
export type GetTalksResponse = Awaited<ReturnType<typeof getTalks>>;

const getTalk = async (talkId: number, userId: string | undefined) => {
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
  if (data[0].recieverId === userId) {
    return { ...data[0], to: data[0].from, from: data[0].from };
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

  return data.map((item) => {
    if (item.recieverId === userId) {
      return { ...item, to: item.from, from: item.to };
    }
    return item;
  });
};

export const useQueryTalk = (talkId: number, userId: string | undefined) =>
  useQuery({
    queryKey: ["talk", talkId.toString(), userId],
    queryFn: async () => await getTalk(talkId, userId),
  });

export const useQueryTalks = (userId: string | undefined) =>
  useQuery({
    queryKey: ["talk", userId],
    queryFn: async () => await getTalks(userId),
  });
