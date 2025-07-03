import {
  createCheckoutSession,
  verifyStripeWebhook,
} from "../services/paymentService.js";

// POST /api/payments/checkout
export async function createCheckout(req, res, next) {
  try {
    const { customerEmail, priceId, successUrl, cancelUrl } = req.body;
    if (!customerEmail || !priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const session = await createCheckoutSession({
      customerEmail,
      priceId,
      successUrl,
      cancelUrl,
    });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

// POST /api/payments/webhook
export async function handleWebhook(req, res, next) {
  try {
    // Stripe requires the raw body for webhook signature verification
    const event = verifyStripeWebhook(req);
    // TODO: Handle different event types as needed
    console.log("Stripe webhook event:", event.type);
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}
