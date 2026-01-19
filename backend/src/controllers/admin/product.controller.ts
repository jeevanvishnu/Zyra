import User from "../../model/user.ts";
import type { Response } from "express";
import type { Request } from "express";
import { log } from "node:console";
import { Products } from "../../model/productmodel.ts";
import cloudinary from "../../lib/cloudinary.ts";


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Products.find({});
   
    res.json(products);
  } catch (error) {
    log("Error coming from getAllProduct ", error.message);
    res.status(500).json({ message: "Something Wrong" });
  }
};



export const addProducts = async (req: Request, res: Response) => {
  try {
    const { productName, price, stock, isActive, category, description } =
      req.body;

    
    if (!productName || !price || !category || !description || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image (max 3)" });
    }

   
    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }

    // Upload all images to Cloudinary
    const imageUrls: string[] = [];

    for (const file of req.files as Express.Multer.File[]) {
      try {
        // Convert buffer to base64 data URI
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'products',
          resource_type: 'auto'
        });

        imageUrls.push(cloudinaryResponse.secure_url);
      } catch (uploadError) {
        log("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Failed to upload images" });
      }
    }

    // Create product with all uploaded images
    const product = await Products.create({
      price: Number(price),
      stock: Number(stock),
      ProductName: productName,
      category,
      description,
      images: imageUrls,
      isActive: isActive === 'true' || isActive === true,
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


