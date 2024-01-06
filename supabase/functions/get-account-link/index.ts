import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.16.0?target=deno";

serve(async (req: Request) => {
  try {
    const { user_id, redirect_url } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_KEY_LIVE") as string, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const account = await stripe.accounts.create({
      country: "JP",
      type: "express",
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      business_type: "individual",
      business_profile: {
        mcc: "6513",
        url: "facebook.com/profile?id=61555230751523",
        product_description:
          "FarmLink is an application that provides a safe environment to start farming.",
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${Deno.env.get(
        "SUPABASE_URL"
      )}/functions/v1/redirect-to-app?user_id=${user_id}&account_id=${
        account.id
      }&redirect_url=${redirect_url}`,
      return_url: `${Deno.env.get(
        "SUPABASE_URL"
      )}/functions/v1/redirect-to-app?user_id=${user_id}&account_id=${
        account.id
      }&redirect_url=${redirect_url}`,
      type: "account_onboarding",
    });

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 400 });
  }
});
