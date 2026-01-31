import express from "express";
import { getWishlist, toggleWishlist } from "../../controllers/user/wishlist.controller.ts";
import { protectRoute } from "../../middleware/protect.middleware.ts";

const router = express.Router();

router.get("/", protectRoute, getWishlist);
router.post("/toggle", protectRoute, toggleWishlist);

export default router;
