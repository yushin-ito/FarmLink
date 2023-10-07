import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Talk, UseMutationResult } from "../../../types";

export type PostTalkResponse = Awaited<ReturnType<typeof postTalk>>;
export type DeleteTalkResponse = Awaited<ReturnType<typeof deleteTalk>>;

const postTalk = async (talk: Talk["Insert"]) => {
  const { data, error } = await supabase.from("talk").upsert(talk).select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteChat = async (talkId: number) => {
  const { data } = await supabase
    .from("chat")
    .select("chatId")
    .eq("talkId", talkId);

  if (data) {
    await Promise.all(
      data.map(
        async (item) =>
          await supabase.from("notification").delete().eq("chatId", item.chatId)
      )
    );
    await supabase.from("chat").delete().eq("talkId", talkId);
  }
};
const deleteTalk = async (talkId: number) => {
  await deleteChat(talkId);
  const { data, error } = await supabase
    .from("talk")
    .delete()
    .eq("talkId", talkId);
  if (error) {
    throw error;
  }
  return data;
};

export const usePostTalk = ({
  onSuccess,
  onError,
}: UseMutationResult<PostTalkResponse, Error>) =>
  useMutation({
    mutationFn: postTalk,
    onSuccess,
    onError,
  });

export const useDeleteTalk = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteTalkResponse, Error>) =>
  useMutation({
    mutationFn: deleteTalk,
    onSuccess,
    onError,
  });
