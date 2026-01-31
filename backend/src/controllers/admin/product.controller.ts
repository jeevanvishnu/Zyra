import type { Request, Response } from "express";
import { Products } from "../../model/productmodel.ts";
import cloudinary from "../../lib/cloudinary.ts";


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4
    const search = req.query.search as string || ""

    const skip = (page - 1) * limit

    const query: any = {};
    if (search) {
      query.ProductName = { $regex: search, $options: "i" };
    }

    const products = await Products.find(query).skip(skip).limit(limit)
    const totalProducts = await Products.countDocuments(query);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error: any) {
    console.error("Error in getAllProducts controller:", error);
    res.status(500).json({ message: "Something Wrong" });
  }
};

export const addProducts = async (req: Request, res: Response) => {
  try {
    const { productName, price, stock, isActive, category, description } = req.body;

    if (!productName || price === undefined || !category || !description || stock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }


    if (!(req as any).files || !Array.isArray((req as any).files) || (req as any).files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image (max 3)" });
    }


    if ((req as any).files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }

    // Upload all images to Cloudinary
    const imageUrls: string[] = [];

    for (const file of (req as any).files) {
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
        console.error("Error uploading image to Cloudinary:", uploadError);
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
  } catch (error: any) {
    console.error("Error in addProducts controller:", error);
    res.status(500).json({ message: "Add Product failed", error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productName, price, stock, isActive, category, description } = req.body;


    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }


    // Handle Image Updates
    let updatedImages: string[] = [];

    // Get kept images from body
    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        updatedImages = [...req.body.existingImages];
      } else {
        updatedImages = [req.body.existingImages];
      }
    }

    if ((req as any).files && Array.isArray((req as any).files) && (req as any).files.length > 0) {
      const newImageUrls: string[] = [];

      for (const file of (req as any).files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'products',
          resource_type: 'auto',
        });

        newImageUrls.push(cloudinaryResponse.secure_url);
      }

      updatedImages = [...updatedImages, ...newImageUrls];
    }


    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
        ProductName: productName || product.ProductName,
        price: price !== undefined ? Number(price) : product.price,
        stock: stock !== undefined ? Number(stock) : product.stock,
        category: category || product.category,
        description: description || product.description,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : product.isActive,
        images: updatedImages
      },
      { new: true }
    );

    res.json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error: any) {
    console.error("Error in updateProduct controller:", error);
    res.status(500).json({ message: "Update Product failed" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await Products.findByIdAndDelete({ _id: id })
    if (!product) {
      return res.status(404).json({ message: "product is not found" })
    }
    res.status(200).json({ message: "Product deleted successfully" })
  } catch (error: any) {
    console.error("Error in deleteProduct controller:", error);
    res.status(500).json({ message: "Product delete failed" });
  }
}
