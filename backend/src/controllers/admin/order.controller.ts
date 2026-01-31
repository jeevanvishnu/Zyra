import type { Request, Response } from "express";
import { Order } from "../../model/order.model.ts";
import User from "../../model/user.ts";
import { Products } from "../../model/productmodel.ts";

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const totalOrders = await Order.countDocuments();
        const orders = await Order.find()
            .populate("user", "name email")
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
        console.error("Error in getAllOrders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { orderStatus: newStatus } = req.body;
        console.log(`Admin Status Update Request: Order=${id}, Status=${newStatus}`);

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const currentStatus = order.orderStatus;
        const validStatuses = ["processing", "shipped", "delivered", "cancelled"];

        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        // Logic check: prevent moving backwards or changing terminal states
        if (currentStatus === "delivered" || currentStatus === "cancelled") {
            return res.status(400).json({ message: `Cannot change status of a ${currentStatus} order` });
        }

        if (currentStatus === "shipped" && newStatus === "processing") {
            return res.status(400).json({ message: "Cannot move order back to processing from shipped" });
        }

        order.orderStatus = newStatus as any;
        await order.save();

        res.json({ message: "Order status updated successfully", order });
    } catch (error: any) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ message: "Failed to update order status" });
    }
};

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const totalUsers = await User.countDocuments();
        const totalProducts = await Products.countDocuments();

        res.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalUsers,
            totalProducts
        });
    } catch (error: any) {
        console.error("Error in getAdminStats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
};
