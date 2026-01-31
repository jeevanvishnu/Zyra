import type { Request, Response } from "express";
import Stripe from "stripe";
import { Order } from "../../model/order.model.ts";
import { handleSuccessfulPayment } from "./order.controller.ts";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as any,
});

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            (req as any).rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err: any) {
        console.error("Stripe webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
            console.log(`Webhook: Processing Stripe payment for order ${orderId}`);
            await handleSuccessfulPayment(orderId, paymentIntent.id);
        }
    }

    res.json({ received: true });
};

export const razorpayWebhook = async (req: Request, res: Response) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
        const signature = req.headers["x-razorpay-signature"] as string;

        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Razorpay webhook signature verification failed");
            return res.status(400).json({ message: "Invalid signature" });
        }

        const event = req.body.event;
        if (event === "order.paid") {
            const razorpayOrderId = req.body.payload.order.entity.id;
            const paymentId = req.body.payload.payment.entity.id;

            const order = await Order.findOne({ razorpayOrderId });
            if (order) {
                console.log(`Webhook: Processing Razorpay payment for order ${order._id}`);
                await handleSuccessfulPayment(order._id as string, paymentId);
            }
        }

        res.json({ status: "ok" });
    } catch (error: any) {
        console.error("Error in Razorpay webhook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
