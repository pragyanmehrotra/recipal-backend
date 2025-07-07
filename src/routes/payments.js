import { Router } from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import {
  createCheckout,
  handleWebhook,
} from "../controllers/paymentController.js";
const router = Router();

// POST /api/payments/checkout (protected)
router.post("/checkout", jwtAuth, createCheckout);

// POST /api/payments/webhook (public, Stripe calls this)
// TODO: Use raw body parser for Stripe webhook signature verification
router.post("/webhook", handleWebhook);

export default router;
