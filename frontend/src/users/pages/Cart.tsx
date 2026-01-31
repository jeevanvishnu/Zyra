import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { userAuthStore } from '@/store/UseUserStore';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart } = userAuthStore();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 500;
    const total = subtotal + shipping;

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8 text-center max-w-md">
                    Looks like you haven't added anything to your cart yet. Explore our latest collections and find something you love!
                </p>
                <Link
                    to="/products"
                    className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-all active:scale-95 shadow-lg flex items-center gap-2"
                >
                    Start Shopping
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
                    <h1 className="text-4xl font-extrabold tracking-tight">Shopping Bag</h1>
                    <span className="ml-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {cart.map((item) => (
                            <div
                                key={item._id}
                                className="group relative flex flex-col sm:flex-row gap-6 p-6 bg-card border border-border rounded-2xl hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 overflow-hidden"
                            >
                                {/* Item Image */}
                                <div className="relative aspect-square w-full sm:w-40 bg-secondary/30 rounded-xl overflow-hidden shrink-0">
                                    <img
                                        src={item.images[0]}
                                        alt={item.ProductName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <Link
                                        to={`/product/${item._id}`}
                                        className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>

                                {/* Item Info */}
                                <div className="flex flex-col flex-grow">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                                                {item.category}
                                            </span>
                                            <Link to={`/product/${item._id}`}>
                                                <h3 className="text-xl font-bold hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                                    {item.ProductName}
                                                </h3>
                                            </Link>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/50">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border border-border/50">
                                            <button
                                                onClick={() => updateQuantity(item._id!, item.quantity - 1)}
                                                className="p-1.5 hover:bg-white dark:hover:bg-black rounded-md transition-all active:scale-90"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id!, item.quantity + 1)}
                                                className="p-1.5 hover:bg-white dark:hover:bg-black rounded-md transition-all active:scale-90"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Utilities */}
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => removeFromCart(item._id!)}
                                                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors group"
                                            >
                                                <div className="p-2 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 rounded-full transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </div>
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <aside className="lg:col-span-4 sticky top-24">
                        <div className="p-8 bg-card border border-border rounded-3xl shadow-lg relative overflow-hidden group">
                            {/* Decorative gradient overlay */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-gray-900/5 to-transparent dark:from-white/5 rounded-full blur-3xl pointer-events-none" />

                            <h2 className="text-2xl font-extrabold mb-8 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground text-sm italic">
                                    <span>Estimated Shipping</span>
                                    <span className="font-semibold text-foreground">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        * Free shipping on orders above ₹5,000
                                    </p>
                                )}
                                <div className="h-px bg-border/50 my-6" />
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold">Total</span>
                                    <div className="text-right">
                                        <p className="text-3xl font-black tracking-tight">₹{total.toLocaleString('en-IN')}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all active:scale-95 shadow-xl hover:shadow-gray-900/20 dark:hover:shadow-white/10 flex items-center justify-center gap-3 group/btn">
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                    <span>Secure processing of your orders</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/products"
                            className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-4 rounded-2xl border border-dashed border-border hover:border-solid group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Continue Shopping
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
