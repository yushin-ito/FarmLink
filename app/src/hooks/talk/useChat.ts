import { useEffect } from "react";
import { supabase } from "../../supabase";

const useChat = (talkId: number, refetch: () => Promise<void>) => {
  useEffect(() => {
    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `talkId=eq.${talkId}`,
        },
        async () => {
          await refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [talkId]);
};

export default useChat;
