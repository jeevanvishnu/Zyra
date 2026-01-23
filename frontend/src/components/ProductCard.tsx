import { ShoppingCart, Star } from 'lucide-react';
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    rating: number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative bg-white dark:bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-secondary/50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Quick Add Button (visible on hover) */}
                <button className="absolute bottom-4 right-4 p-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95">
                    <ShoppingCart className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title and Price */}
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        {product.name}
                    </h3>
                    <span className="font-bold text-lg">
                        ${product.price.toFixed(2)}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                        />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                        ({product.rating.toFixed(1)})
                    </span>
                </div>

                {/* Add to Cart Button (Mobile/Fallback) */}
                <button className="w-full mt-2 sm:hidden py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
