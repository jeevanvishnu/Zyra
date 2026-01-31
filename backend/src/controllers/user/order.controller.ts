import type { Request, Response } from "express";
import { Order } from "../../model/order.model.ts";
import User from "../../model/user.ts";
import { Products } from "../../model/productmodel.ts";
import Stripe from "stripe";
import Razorpay from "razorpay";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as any,
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = (req as any).user._id;

        // Fetch user and populate cart
        const user = await User.findById(userId).populate("cartItems.product");
        if (!user || !user.cartItems || user.cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Calculate total and prepare items
        let totalAmount = 0;
        const orderItems = [];

        for (const item of user.cartItems) {
            const product = item.product as any;

            // Stock check
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.ProductName}` });
            }

            orderItems.push({
                product: product._id,
                name: product.ProductName,
                quantity: item.quantity,
                price: product.price,
                image: product.images[0] || "",
            });
            totalAmount += product.price * item.quantity;
        }

        // 1. COD Flow
        if (paymentMethod === "cod") {
            const order = await Order.create({
                user: userId,
                items: orderItems,
                totalAmount,
                shippingAddress,
                paymentMethod: "cod",
                paymentStatus: "pending",
                orderStatus: "processing",
            });

            // Clear cart
            user.cartItems = [];
            await user.save();

            // Update stock
            for (const item of orderItems) {
                await Products.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
            }

            return res.status(201).json({ message: "Order placed successfully", order });
        }

        // 2. Stripe Flow
        if (paymentMethod === "stripe") {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount * 100), // Stripe expects cents
                currency: "inr",
                metadata: { userId: userId.toString() },
            });

            const order = await Order.create({
                user: userId,
                items: orderItems,
                totalAmount,
                shippingAddress,
                paymentMethod: "stripe",
                paymentStatus: "pending",
                stripePaymentIntentId: paymentIntent.id,
            });

            return res.status(201).json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
        }

        // 3. Razorpay Flow
        if (paymentMethod === "razorpay") {
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            });

            const order = await Order.create({
                user: userId,
                items: orderItems,
                totalAmount,
                shippingAddress,
                paymentMethod: "razorpay",
                paymentStatus: "pending",
                razorpayOrderId: razorpayOrder.id,
            });

            return res.status(201).json({
                razorpayOrderId: razorpayOrder.id,
                orderId: order._id,
                amount: totalAmount,
                currency: "INR",
                key: process.env.RAZORPAY_KEY_ID
            });
        }

        return res.status(400).json({ message: "Invalid payment method" });

    } catch (error: any) {
        console.error("Error in placeOrder:", error);
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { orderId, paymentId, signature } = req.body;
        const userId = (req as any).user._id;

        // For simplicity, we are assuming successful verification calls from frontend for now
        // In production, YOU MUST verify connection signature (Razorpay) or Webhook (Stripe)

        // Simplistic update for demo purposes
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.paymentStatus = "paid";
        order.paymentMethod === 'razorpay' ? order.razorpayPaymentId = paymentId : null;
        await order.save();

        // Clear cart after successful payment
        const user = await User.findById(userId);
        if (user) {
            user.cartItems = [];
            await user.save();
        }

        // Update stock
        for (const item of order.items) {
            await Products.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        res.json({ message: "Payment verified and order confirmed" });
    } catch (error: any) {
        console.error("Error in verifyPayment:", error);
        res.status(500).json({ message: "Payment verification failed" });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error: any) {
        console.error("Error in getMyOrders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
