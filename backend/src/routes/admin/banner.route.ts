import express from "express";
import { getBanners, createBanner, updateBanner, deleteBanner, toggleBannerStatus } from "../../controllers/admin/banner.controller.ts";
import { protectRoute, isAdmin } from "../../middleware/protect.middleware.ts";

const router = express.Router();

router.get("/", protectRoute, isAdmin, getBanners);
router.post("/", protectRoute, isAdmin, createBanner);
router.put("/:id", protectRoute, isAdmin, updateBanner);
router.delete("/:id", protectRoute, isAdmin, deleteBanner);
router.patch("/:id/toggle", protectRoute, isAdmin, toggleBannerStatus);

export default router;
