import { useQuery } from "@tanstack/react-query";

import { supabase } from "../../../supabase";

export type GetPaymentSheetParamsResponse = Awaited<
  ReturnType<typeof getPaymentSheetParams>
>;

const getPaymentSheetParams = async (
  stripeId: string | null | undefined,
  price: number
) => {
  if (!stripeId) {
    return;
  }
  const { data, error } = await supabase.functions.invoke(
    "get-payment-sheet-params",
    {
      body: { account_id: stripeId, amount: price },
    }
  );

  if (error) {
    throw error;
  }
  return data;
};

export const useQueryPaymentSheetParams = (
  stripeId: string | null | undefined,
  price: number
) =>
  useQuery({
    queryKey: ["payment", stripeId],
    queryFn: async () => await getPaymentSheetParams(stripeId, price),
  });
