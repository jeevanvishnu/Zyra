import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, CreditCard, ChevronLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { userAuthStore } from '@/store/UseUserStore';

// Dummy products for recommendation
const RECOMMENDED_PRODUCTS = [
    {
        _id: '1',
        ProductName: "Premium Cotton Tee",
        price: 999,
        description: "High-quality cotton t-shirt for everyday comfort.",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
        category: "Clothing"
    },
    {
        _id: '2',
        ProductName: "Urban Cargo Jacket",
        price: 2499,
        description: "Stylish and functional cargo jacket for the modern explorer.",
        images: ["https://images.unsplash.com/photo-1551028919-ac7675cf5063?q=80&w=800&auto=format&fit=crop"],
        category: "Outerwear"
    },
    {
        _id: '3',
        ProductName: "Minimalist Sneakers",
        price: 3500,
        description: "Clean design sneakers that go with everything.",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"],
        category: "Footwear"
    },
    {
        _id: '4',
        ProductName: "Tech Fleece Hoodie",
        price: 1800,
        description: "Warm and breathable fleece hoodie for athletic activities.",
        images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"],
        category: "Clothing"
    },
];

const ProductDetails = () => {
    const { id } = useParams();
    const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop");
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center" });
    const [isZoomed, setIsZoomed] = useState(false);

    // Use store actions and state
    const { getProductById, currentProduct, isLoading, addToCart, products: allProducts } = userAuthStore();

    useEffect(() => {
        if (id) {
            getProductById(id);
        }
    }, [id, getProductById]);

    useEffect(() => {
        if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
            setMainImage(currentProduct.images[0]);
        }
        window.scrollTo(0, 0);
    }, [currentProduct]);

    // Use actual products for recommendations if available
    const recommendations = allProducts.filter(p => p._id !== id).slice(0, 4);
    const displayRecommendations = recommendations.length > 0 ? recommendations : RECOMMENDED_PRODUCTS;

    if (isLoading && !currentProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Loading product details...</p>
            </div>
        );
    }

    if (!currentProduct) return null;

    const product = currentProduct;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomStyle({ transformOrigin: `${x}% ${y}%` });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs / Back Button */}
                <Link to="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div
                            className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden border border-border cursor-zoom-in relative"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                        >
                            <img
                                src={mainImage}
                                alt={product.ProductName}
                                className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                style={zoomStyle}
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{product.category}</span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mt-2">{product.ProductName}</h1>
                            <div className="flex items-center mt-4 gap-2">
                                <div className="flex items-center text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">(4.0 / 5.0 - 124 reviews)</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <span className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                {product.description || "Discover the perfect blend of style and comfort with our premium collection. Crafted from high-quality materials, this product is designed to elevate your everyday look while providing lasting durability. Whether you're dressing up for an occasion or keeping it casual, Zyra ensures you stay ahead in fashion without compromising on quality."}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 mb-10">
                            <button
                                onClick={() => addToCart(product)}
                                className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button className="w-full py-4 border-2 border-black dark:border-white text-black dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95">
                                <CreditCard className="w-5 h-5" />
                                Buy Now
                            </button>
                        </div>

                        {/* Features / Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border mt-auto">
                            <div className="flex flex-col items-center text-center space-y-2 text-foreground">
                                <div className="p-3 bg-secondary/50 rounded-full">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold">Free Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 text-foreground">
                                <div className="p-3 bg-secondary/50 rounded-full">
                                    <RotateCcw className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold">30 Days Return</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 text-foreground">
                                <div className="p-3 bg-secondary/50 rounded-full">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-semibold">Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Products */}
                <div className="mt-24">
                    <h2 className="text-2xl font-bold mb-10 tracking-tight text-foreground">Recommended Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayRecommendations.map((p) => (
                            <ProductCard key={p._id} product={p as any} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
