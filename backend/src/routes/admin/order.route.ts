import express from "express";
import { getAllOrders, updateOrderStatus, getAdminStats } from "../../controllers/admin/order.controller.ts";
import { protectRoute, isAdmin } from "../../middleware/protect.middleware.ts";

const router = express.Router();

router.get("/", protectRoute, isAdmin, getAllOrders);
router.get("/stats", protectRoute, isAdmin, getAdminStats);
router.put("/:id/status", protectRoute, isAdmin, updateOrderStatus);

export default router;
