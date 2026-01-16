import User from '../../model/user.ts';
import express from 'express'
import { Response } from 'express';
import { Request } from 'express';
import { log } from 'node:console';
import { Products} from '../../model/productmodel.ts';

export const getAllProducts = async (req:Request , res:Response)=>{
    try {
        const products = await User.find({})
        res.json(products)
    } catch (error) {
        log("Error coming from getAllProduct ",error.message)
        res.status(500).json({message:"Something Wrong"})
    }
}

export const addProducts = async (req:Request , res:Response)=>{
    try {
        const{productName , price , stock , isActive , category , description} = req.body
        const { image } = req.files as any;
        
        if(!productName || !price || !category ||!description ||!stock){
            return res.status(400).json({message:"All field required"})
        }
        if(!image){
            return res.status(400).json({message:"Please upload 3 image"})
        }
        const product = await Products.create({
            price,
            stock,
            ProductName:productName,
            category,
            description,
            isActive
        })
        res.status(201).json({
        message: "Product created successfully",
        product,
        });

       
    } catch (error) {
        log("Error is coming from addProducts",error.message)
        res.status(500).json({message:"Add Product failed"})
    }
}