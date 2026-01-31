import type { Request, Response } from "express";
import User from "../../model/user.ts";

export const addAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const address = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (address.isDefault) {
            // Unset other default addresses
            user.addresses.forEach(a => a.isDefault = false);
        }

        user.addresses.push(address);
        await user.save();
        res.status(201).json(user.addresses);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const addressId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.addresses = user.addresses.filter(a => a._id?.toString() !== addressId);
        await user.save();
        res.json(user.addresses);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const addressId = req.params.id;
        const updatedAddress = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const addressIndex = user.addresses.findIndex(a => a._id?.toString() === addressId);
        if (addressIndex === -1) return res.status(404).json({ message: "Address not found" });

        if (updatedAddress.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        }

        user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...updatedAddress };
        await user.save();
        res.json(user.addresses);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAddresses = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.addresses);
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
