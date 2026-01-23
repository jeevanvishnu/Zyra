import { Products } from "../../model/productmodel.ts"
import {Request , Response} from "express"

export const getFeatureProduct = async (req:Request , res:Response) =>{
    try {
        const product = await Products.find()
        if(!product){
            return res.status(404).json({message:"Product Not Found"})
        }
        res.json(product)
        
    } catch (error) {
        console.log("Error is coming from getFeatureProduct",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}