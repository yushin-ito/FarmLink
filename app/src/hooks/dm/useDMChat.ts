import { useEffect } from "react";
import { supabase } from "../../supabase";

const useDMChat = (dmId: number, refetch: () => Promise<void>) => {
  useEffect(() => {
    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat",
          filter: `dmId=eq.${dmId}`,
        },
        async () => {
          await refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dmId]);
};

export default useDMChat;
