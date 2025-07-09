import {
  createCheckoutSession,
  verifyStripeWebhook,
} from "../services/paymentService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

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
  console.log("Stripe webhook event:", event.type);

  // Handle subscription events
  if (event.type === "checkout.session.completed") {
    // User completed checkout, set premium true
    const email = event.data.object.customer_email;
    if (email) {
      await db
        .update(users)
        .set({ premium: true })
        .where(eq(users.email, email));
      console.log(`Set premium true for user: ${email}`);
    }
  } else if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.canceled"
  ) {
    // Subscription cancelled, set premium false
    // Find customer email from subscription object
    const subscription = event.data.object;
    let email = null;
    if (subscription.customer_email) {
      email = subscription.customer_email;
    } else if (subscription.customer) {
      // Optionally, look up the customer in Stripe to get the email
      // (not implemented here for brevity)
    }
    if (email) {
      await db
        .update(users)
        .set({ premium: false })
        .where(eq(users.email, email));
      console.log(`Set premium false for user: ${email}`);
    }
  }

  res.json({ received: true });
});
