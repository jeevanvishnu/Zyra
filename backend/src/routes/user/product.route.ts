import express from "express"
import { getFeatureProduct } from "../../controllers/user/product.controller.ts"
const router = express.Router()

router.get('/',getFeatureProduct)

export default router