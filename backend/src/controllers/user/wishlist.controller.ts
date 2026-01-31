import type { Request, Response } from "express";
import User from "../../model/user.ts";

export const getWishlist = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user?._id).populate("wishlist");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.wishlist || []);
    } catch (error: any) {
        console.error("Error in getWishlist controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleWishlist = async (req: any, res: Response) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isWishlisted = user.wishlist.includes(productId as any);

        if (isWishlisted) {
            user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        } else {
            user.wishlist.push(productId as any);
        }

        await user.save();
        res.json(user.wishlist);
    } catch (error: any) {
        console.error("Error in toggleWishlist controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
