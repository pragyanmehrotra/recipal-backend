import {
  createCheckoutSession,
  verifyStripeWebhook,
} from "../services/paymentService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// POST /api/payments/checkout
export const createCheckout = asyncHandler(async (req, res) => {
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
});

// POST /api/payments/webhook
export const handleWebhook = asyncHandler(async (req, res) => {
  // Stripe requires the raw body for webhook signature verification
  const event = verifyStripeWebhook(req);
  // TODO: Handle different event types as needed
  console.log("Stripe webhook event:", event.type);
  res.json({ received: true });
});
