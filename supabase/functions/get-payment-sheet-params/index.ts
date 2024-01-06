import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.16.0?target=deno";

serve(async (req: Request) => {
  try {
    const commission = 10;

    const { account_id, amount } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_KEY_LIVE") as string, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const customer = await stripe.customers.create();

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "jpy",
      customer: customer.id,
      application_fee_amount: amount * (commission / 100),
      transfer_data: {
        destination: account_id,
      },
      payment_method_types: ["card"],
    });

    return new Response(
      JSON.stringify({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 400 });
  }
});
