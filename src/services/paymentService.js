import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Create a Stripe Checkout session
export async function createCheckoutSession({
  customerEmail,
  priceId,
  successUrl,
  cancelUrl,
}) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: customerEmail,
    line_items: [
      {
        price: priceId, // Stripe Price ID for the subscription/product
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

// Verify and handle Stripe webhook events
export function verifyStripeWebhook(req) {
  const sig = req.headers["stripe-signature"];
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (err) {
    throw new Error(`Webhook Error: ${err.message}`);
  }
}
