import express from "express"
import { addProducts, deleteProduct, getAllProducts, updateProduct } from "../../controllers/admin/product.controller.ts"
import { protectRoute, isAdmin } from "../../middleware/protect.middleware.ts"
import { upload } from "../../middleware/upload.middleware.ts"
const router = express.Router()

router.get('/', protectRoute, isAdmin, getAllProducts)
router.post('/', protectRoute, isAdmin, upload.array('image', 3), addProducts)
router.put('/:id', protectRoute, isAdmin, upload.array('image', 3), updateProduct)
router.delete('/:id',protectRoute, isAdmin , deleteProduct)

export default router