import { useEffect } from "react";
import { supabase } from "../../supabase";

export const useFarmLike = (farmId: number, refetch: () => Promise<void>) => {
  useEffect(() => {
    const channel = supabase
      .channel("like")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "like",
          filter: `farmId=eq.${farmId}`,
        },
        async () => {
          await refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [farmId]);
};

export const useRentalLike = (
  rentalId: number,
  refetch: () => Promise<void>
) => {
  useEffect(() => {
    const channel = supabase
      .channel("like")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "like",
          filter: `rentalId=eq.${rentalId}`,
        },
        async () => {
          await refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rentalId]);
};
