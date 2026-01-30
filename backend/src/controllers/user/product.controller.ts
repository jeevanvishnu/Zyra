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

 export const allProducts = async (req:Request , res:Response)=>{
    try {
        const {category} = req.query
        if(!category){
            res.status(500).json({message:"Internal server error "})
        }
        const product = await Products.find({category})
        if(!product){
            res.status(404).json({message:"Product not found"})
        }
        res.json(product)
        
    } catch (error) {
     console.log("Error is coming from allProducts",error.message)
      res.status(500).json({message:"Internal server error"})
    }
 }