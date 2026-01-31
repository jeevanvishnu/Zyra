import express from "express";
import { stripeWebhook, razorpayWebhook } from "../../controllers/user/webhook.controller.ts";

const router = express.Router();

// Note: Stripe webhook needs raw body, we'll handle this in server.ts
router.post("/stripe", express.raw({ type: 'application/json' }), stripeWebhook);
router.post("/razorpay", razorpayWebhook);

export default router;
