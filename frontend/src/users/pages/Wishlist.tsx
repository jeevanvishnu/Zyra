import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Heart, ArrowRight, ChevronLeft } from 'lucide-react';
import { userAuthStore } from '@/store/UseUserStore';

const WishlistPage = () => {
    const { wishlist, toggleWishlist, addToCart } = userAuthStore();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-8 text-center max-w-md">
                    Start saving your favorite items to your wishlist and they'll show up here!
                </p>
                <Link
                    to="/products"
                    className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-all active:scale-95 shadow-lg flex items-center gap-2"
                >
                    Explore Products
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background border-t border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-2 mb-8">
                    <Link to="/products" className="p-2 hover:bg-secondary rounded-full transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <h1 className="text-4xl font-extrabold tracking-tight">Your Wishlist</h1>
                    <span className="ml-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <div
                            key={product._id}
                            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-500"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
                                <img
                                    src={product.images[0]}
                                    alt={product.ProductName}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />

                                {/* Overlay with actions */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <button
                                    onClick={() => toggleWishlist(product._id!)}
                                    className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-black/90 text-red-500 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all z-10"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-5 space-y-4">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                                        {product.category}
                                    </span>
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                            {product.ProductName}
                                        </h3>
                                    </Link>
                                    <p className="text-xl font-black mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        addToCart(product);
                                        toggleWishlist(product._id!);
                                    }}
                                    className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-black/20 dark:hover:shadow-white/10"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Move to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
