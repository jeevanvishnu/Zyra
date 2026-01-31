import type { Request, Response } from "express";
import { Banner } from "../../model/banner.model.ts";
import cloudinary from "../../lib/cloudinary.ts"; // Assuming cloudinary is configured

export const getBanners = async (req: Request, res: Response) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.json(banners);
    } catch (error: any) {
        console.error("Error in getBanners:", error);
        res.status(500).json({ message: "Failed to fetch banners" });
    }
};

export const createBanner = async (req: Request, res: Response) => {
    try {
        const { title, description, image, link, location } = req.body;

        let imageUrl = "";
        if (image && image.startsWith("data:image")) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "banners",
            });
            imageUrl = uploadResponse.secure_url;
        } else {
            imageUrl = image;
        }

        const banner = new Banner({
            title,
            description,
            image: imageUrl,
            link,
            location
        });

        await banner.save();
        res.status(201).json({ message: "Banner created successfully", banner });
    } catch (error: any) {
        console.error("Error in createBanner:", error);
        res.status(500).json({ message: "Failed to create banner" });
    }
};

export const updateBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, image, link, location, isActive } = req.body;

        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        if (image && image.startsWith("data:image")) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "banners",
            });
            banner.image = uploadResponse.secure_url;
        }

        if (title !== undefined) banner.title = title;
        if (description !== undefined) banner.description = description;
        if (link !== undefined) banner.link = link;
        if (location !== undefined) banner.location = location;
        if (isActive !== undefined) banner.isActive = isActive;

        await banner.save();
        res.json({ message: "Banner updated successfully", banner });
    } catch (error: any) {
        console.error("Error in updateBanner:", error);
        res.status(500).json({ message: "Failed to update banner" });
    }
};

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        // Delete from cloudinary if applicable
        if (banner.image.includes("cloudinary")) {
            const publicId = banner.image.split("/").pop()?.split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(`banners/${publicId}`);
            }
        }

        await Banner.findByIdAndDelete(id);
        res.json({ message: "Banner deleted successfully" });
    } catch (error: any) {
        console.error("Error in deleteBanner:", error);
        res.status(500).json({ message: "Failed to delete banner" });
    }
};

export const toggleBannerStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        banner.isActive = !banner.isActive;
        await banner.save();
        res.json({ message: `Banner space ${banner.isActive ? "activated" : "deactivated"}`, banner });
    } catch (error: any) {
        console.error("Error in toggleBannerStatus:", error);
        res.status(500).json({ message: "Failed to toggle banner status" });
    }
};
