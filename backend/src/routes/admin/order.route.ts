import express from "express";
import { getAllOrders, updateOrderStatus } from "../../controllers/admin/order.controller.ts";
import { protectRoute, isAdmin } from "../../middleware/protect.middleware.ts";

const router = express.Router();

router.get("/", protectRoute, isAdmin, getAllOrders);
router.put("/:id/status", protectRoute, isAdmin, updateOrderStatus);

export default router;
