import { useEffect } from "react";
import { supabase } from "../../supabase";

const useChat = (communityId: number, refetch: () => Promise<void>) => {
  useEffect(() => {
    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `communityId=eq.${communityId}`,
        },
        async () => {
          await refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId]);
};

export default useChat;
