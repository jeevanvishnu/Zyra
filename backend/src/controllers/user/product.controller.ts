import { Products } from "../../model/productmodel.ts"
import type { Request, Response } from "express"

export const getFeatureProduct = async (req: Request, res: Response) => {
    try {
        const product = await Products.find({ isActive: true }).sort({ createdAt: -1 })
        if (product.length === 0) {
            return res.status(404).json({ message: "Product Not Found" })
        }
        res.json(product)

    } catch (error) {
        console.log("Error is coming from getFeatureProduct", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Products.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.log("Error is coming from getProductById", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const allProducts = async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;

        // Build query
        const query: any = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.ProductName = { $regex: search, $options: "i" };
        }

        // Build sort
        let sortOptions: any = { createdAt: -1 };
        if (sort === "price_asc") sortOptions = { price: 1 };
        if (sort === "price_desc") sortOptions = { price: -1 };
        if (sort === "oldest") sortOptions = { createdAt: 1 };

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Products.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await Products.countDocuments(query);

        res.json({
            products,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / Number(limit)),
            totalProducts
        });

    } catch (error) {
        console.log("Error is coming from allProducts", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};