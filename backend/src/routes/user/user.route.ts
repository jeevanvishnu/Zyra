import express from "express";
import { addAddress, deleteAddress, updateAddress, getAddresses } from "../../controllers/user/address.controller.ts";
import { updateProfile } from "../../controllers/auth.controller.ts";
import { protectRoute } from "../../middleware/protect.middleware.ts";

const router = express.Router();

// Profile Routes
router.put("/profile", protectRoute, updateProfile);

// Address Routes
router.get("/address", protectRoute, getAddresses);
router.post("/address", protectRoute, addAddress);
router.put("/address/:id", protectRoute, updateAddress);
router.delete("/address/:id", protectRoute, deleteAddress);

export default router;
