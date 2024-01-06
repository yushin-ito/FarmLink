import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import Stripe from "https://esm.sh/stripe@11.16.0?target=deno";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const stripeId = url.searchParams.get("account_id");
    const redirectUrl = url.searchParams.get("redirect_url");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_KEY_LIVE") as string, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const account = await stripe.account.retrieve(stripeId as string);
    if (account.details_submitted) {
      const { error } = await supabase
        .from("user")
        .update({ stripeId })
        .eq("userId", userId);

      if (error) {
        throw error;
      }
    }

    return Response.redirect(redirectUrl as string);
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 400 });
  }
});
