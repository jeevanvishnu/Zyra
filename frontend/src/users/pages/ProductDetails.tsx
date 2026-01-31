import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, Star, ShieldCheck, Truck, RotateCcw, Heart, Zap } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { userAuthStore } from '@/store/UseUserStore';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState("");
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center" });
    const [isZoomed, setIsZoomed] = useState(false);

    // Use store actions and state
    const {
        getProductById,
        currentProduct,
        isLoading,
        addToCart,
        toggleWishlist,
        wishlist,
        products: allProducts,
        fetchProducts
    } = userAuthStore();

    const isWishlisted = useMemo(() =>
        wishlist.some(p => p._id === id),
        [wishlist, id]);

    useEffect(() => {
        if (id) {
            getProductById(id);
        }
        // Fetch products for recommendations if they don't exist
        if (allProducts.length === 0) {
            fetchProducts();
        }
    }, [id, getProductById, allProducts.length, fetchProducts]);

    useEffect(() => {
        if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
            setMainImage(currentProduct.images[0]);
        }
        window.scrollTo(0, 0);
    }, [currentProduct]);

    // Use actual products for recommendations
    const recommendations = allProducts.filter(p => p._id !== id).slice(0, 4);

    if (isLoading && !currentProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Loading product details...</p>
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Link to="/products" className="text-primary hover:underline flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Products
                </Link>
            </div>
        );
    }

    const product = currentProduct;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomStyle({ transformOrigin: `${x}% ${y}%` });
    };

    const handleBuyNow = async () => {
        if (product && product.stock > 0) {
            await addToCart(product);
            navigate('/cart');
        }
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
                            {mainImage && (
                                <img
                                    src={mainImage}
                                    alt={product.ProductName}
                                    className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                    style={zoomStyle}
                                />
                            )}

                            {/* Wishlist Toggle Button */}
                            <button
                                onClick={() => toggleWishlist(product._id!)}
                                className="absolute top-6 right-6 p-3 bg-white/90 dark:bg-black/90 rounded-full shadow-xl z-10 transition-all hover:scale-110 active:scale-95 group/wishlist"
                            >
                                <Heart
                                    className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover/wishlist:text-red-500'}`}
                                />
                            </button>
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
                                <div className="flex items-center text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">(4.0 / 5.0)</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <span className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                            <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </div>
                            <p className="text-muted-foreground mt-6 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 mb-10">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                    className="flex-1 py-4 bg-secondary text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.stock > 0 ? "Add to Cart" : "Currently Unavailable"}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.stock === 0}
                                    className="flex-1 py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <Zap className="w-5 h-5 fill-current" />
                                    {product.stock > 0 ? "Buy Now" : "Out of Stock"}
                                </button>
                            </div>
                        </div>

                        {/* Features / Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border mt-auto">
                            <div className="flex flex-col items-center text-center space-y-2 text-foreground text-sm">
                                <div className="p-3 bg-secondary/50 rounded-full">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">Free Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 text-foreground text-sm">
                                <div className="p-3 bg-secondary/50 rounded-full">
                                    <RotateCcw className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">30 Days Return</span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2 text-foreground text-sm">
                                <div className="p-3 bg-secondary/50 rounded-full">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Products */}
                {recommendations.length > 0 && (
                    <div className="mt-24">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">Recommended Products</h2>
                            <Link to="/products" className="text-sm font-bold hover:underline">View All</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {recommendations.map((p) => (
                                <ProductCard key={p._id} product={p as any} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
