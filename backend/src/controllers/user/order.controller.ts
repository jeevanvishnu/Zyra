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

export const handleSuccessfulPayment = async (orderId: string, paymentId?: string) => {
    const order = await Order.findById(orderId);
    if (!order || order.paymentStatus === "paid") {
        return order;
    }

    order.paymentStatus = "paid";
    if (paymentId) {
        if (order.paymentMethod === 'razorpay') order.razorpayPaymentId = paymentId;
        if (order.paymentMethod === 'stripe') order.stripePaymentIntentId = paymentId;
    }
    await order.save();

    // Clear cart
    const user = await User.findById(order.user);
    if (user) {
        user.cartItems = [];
        await user.save();
    }

    // Update stock
    for (const item of order.items) {
        await Products.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    return order;
};

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

            await handleSuccessfulPayment(order._id as string);

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

            // Update payment intent with orderId for webhook identification
            await stripe.paymentIntents.update(paymentIntent.id, {
                metadata: { orderId: order._id.toString() }
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
        const { orderId, paymentId } = req.body;

        const order = await handleSuccessfulPayment(orderId, paymentId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        const totalOrders = await Order.countDocuments({ user: userId });
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        });
    } catch (error: any) {
        console.error("Error in getMyOrders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

export const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { id } = req.params;

        const order = await Order.findOne({ _id: id, user: userId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error: any) {
        console.error("Error in getOrderDetails:", error);
        res.status(500).json({ message: "Failed to fetch order details" });
    }
};
