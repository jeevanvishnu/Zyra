import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userAuthStore } from '@/store/UseUserStore';

interface Product {
    _id?: string;
    ProductName: string;
    price: number;
    description: string;
    images: string[];
    rating?: number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = userAuthStore();

    return (
        <div className="group relative bg-white dark:bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-300">
            {/* Image Container */}
            <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-secondary/50">
                <img
                    src={product?.images?.[0]}
                    alt={product?.ProductName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Quick Add Button (visible on hover) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product as any);
                    }}
                    className="absolute bottom-4 right-4 p-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 z-10"
                >
                    <ShoppingCart className="w-5 h-5" />
                </button>
            </Link>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title and Price */}
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        {product?.ProductName}
                    </h3>
                    <span className="font-bold text-lg">
                        ₹{product?.price?.toLocaleString('en-IN')}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {product?.description}
                </p>

                {/* Add to Cart Button (Mobile/Fallback) */}
                <button
                    onClick={() => addToCart(product as any)}
                    className="w-full mt-2 sm:hidden py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
