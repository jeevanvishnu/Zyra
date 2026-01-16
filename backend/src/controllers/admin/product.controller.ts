import User from "../../model/user.ts";
import type { Response } from "express";
import type { Request } from "express";
import { log } from "node:console";
import { Products } from "../../model/productmodel.ts";
import cloudinary from "../../lib/cloudinary.ts";


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await User.find({});
    res.json(products);
  } catch (error) {
    log("Error coming from getAllProduct ", error.message);
    res.status(500).json({ message: "Something Wrong" });
  }
};

export const addProducts = async (req: Request, res: Response) => {
  try {
    let cloudinaryResponse = null
    const { productName, price, stock, isActive, category, description } =
      req.body;
    const { image } = req.files as any;

    if (!productName || !price || !category || !description || !stock) {
      return res.status(400).json({ message: "All field required" });
    }
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: "Please upload images" });
    }

    cloudinaryResponse = await cloudinary.uploader.upload('image',{folder:'product'})

    const product = await Products.create({
      price,
      stock,
      ProductName: productName,
      category,
      description,
      image:cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : '',
      isActive,
    });
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    log("Error is coming from addProducts", error.message);
    res.status(500).json({ message: "Add Product failed" });
  }
};


