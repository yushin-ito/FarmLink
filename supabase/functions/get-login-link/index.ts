import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.16.0?target=deno";

serve(async (req: Request) => {
  try {
    const { account_id } = await req.json();
    const stripe = new Stripe(Deno.env.get("STRIPE_KEY_LIVE") as string, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const loginLink = await stripe.accounts.createLoginLink(account_id);

    return new Response(JSON.stringify({ url: loginLink.url }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 400 });
  }
});
