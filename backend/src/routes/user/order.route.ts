import express from "express";
import { placeOrder, verifyPayment, getMyOrders } from "../../controllers/user/order.controller.ts";
import { protectRoute } from "../../middleware/protect.middleware.ts";

const router = express.Router();

router.post("/place-order", protectRoute, placeOrder);
router.post("/verify-payment", protectRoute, verifyPayment);
router.get("/", protectRoute, getMyOrders);

export default router;
