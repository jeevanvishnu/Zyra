import { Products } from "../../model/productmodel.ts"
import type {Request , Response} from "express"

export const getFeatureProduct = async (req:Request , res:Response) =>{
    try {
        const product = await Products.find({isActive:true}).sort({createdAt:-1})
        if(product.length === 0){
            return res.status(404).json({message:"Product Not Found"})
        }
        res.json(product)
        
    } catch (error) {
        console.log("Error is coming from getFeatureProduct",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}