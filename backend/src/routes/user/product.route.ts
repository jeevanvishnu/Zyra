import express from "express"
import { getFeatureProduct, allProducts, getProductById } from "../../controllers/user/product.controller.ts"
const router = express.Router()

router.get('/', getFeatureProduct)
router.get('/all', allProducts)
router.get('/:id', getProductById)

export default router