import type { Request, Response } from "express";
import User from "../../model/user.ts";
import { Products } from "../../model/productmodel.ts";

export const getCartProducts = async (req: any, res: Response) => {
    try {
        console.log("Fetching cart for user:", req.user?._id);
        const user = await User.findById(req.user?._id).populate("cartItems.product");
        if (!user) {
            console.log("User not found in getCartProducts");
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.cartItems || []);
    } catch (error: any) {
        console.error("Error in getCartProducts controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const addToCart = async (req: any, res: Response) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingItem = user.cartItems.find((item: any) => item.product?.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ product: productId, quantity: 1 } as any);
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error: any) {
        console.error("Error in addToCart controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeAllFromCart = async (req: any, res: Response) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter((item: any) => item.product?.toString() !== productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error: any) {
        console.error("Error in removeAllFromCart controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateQuantity = async (req: any, res: Response) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingItem = user.cartItems.find((item: any) => item.product.toString() === productId);

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item: any) => item.product.toString() !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error: any) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
