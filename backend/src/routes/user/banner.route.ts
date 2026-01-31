import express from "express";
import { getBanners } from "../../controllers/admin/banner.controller.ts";
import { Banner } from "../../model/banner.model.ts";

const router = express.Router();

// Publicly accessible banners for homepage
router.get("/", async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to fetch banners" });
    }
});

export default router;
