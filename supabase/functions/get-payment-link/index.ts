import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.16.0?target=deno";

serve(async (req: Request) => {
  try {
    const { _type, account_id } = await req.json();
    const stripe = new Stripe(Deno.env.get("STRIPE_KEY_TEST") as string, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const price = await stripe.prices.create({
      currency: "jpy",
      unit_amount: 1000,
      recurring: {
        interval: "month",
      },
      product_data: {
        name: "Gold Plan",
      },
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      application_fee_percent: 10,
      transfer_data: {
        destination: account_id,
      },
    });

    return new Response(JSON.stringify({ url: paymentLink.url }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 400 });
  }
});
