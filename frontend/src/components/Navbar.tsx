import { useState } from 'react';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userAuthStore } from '@/store/UseUserStore';

interface NavbarProps {
    cartCount?: number;
    wishlistCount?: number;
    onSearch?: (query: string) => void;
}

export default function Navbar({
    cartCount = 0,
    wishlistCount = 0,
    onSearch
}: NavbarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        }
    };

    const { user } = userAuthStore()
    console.log("....", user.name);


    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                            ZYRA
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="hidden md:flex flex-1 max-w-2xl mx-8"
                    >
                        <div className="relative w-full group">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-gray-700/20 dark:from-gray-100/20 dark:to-gray-300/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full pl-12 pr-4 py-2.5 bg-secondary/50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900/50 dark:focus:ring-gray-100/50 focus:border-gray-900 dark:focus:border-gray-100 transition-all duration-300 placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>
                    </form>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className="relative p-2 rounded-full hover:bg-secondary/80 transition-all duration-300 group"
                        >
                            <Heart className="w-6 h-6 text-foreground group-hover:text-red-600 group-hover:fill-red-600 transition-all duration-300" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-full hover:bg-secondary/80 transition-all duration-300 group"
                        >
                            <ShoppingCart className="w-6 h-6 text-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Login Button - Desktop */}
                        {/* User Profile - Desktop */}
                        {user ? (
                            <div className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 bg-secondary/50 border border-border rounded-full hover:bg-secondary transition-colors duration-300">
                                <div className="p-1.5 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-full text-white dark:text-gray-900">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-sm max-w-[100px] truncate">{user.name}</span>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-full hover:shadow-lg hover:shadow-gray-900/50 dark:hover:shadow-gray-100/50 transition-all duration-300 transform hover:scale-105 font-medium"
                            >
                                <User className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                        )}
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-secondary/80 transition-colors duration-300"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-4 animate-in slide-in-from-top duration-300">
                        {/* Search Bar - Mobile */}
                        <form onSubmit={handleSearchSubmit} className="w-full">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full pl-12 pr-4 py-2.5 bg-secondary/50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900/50 dark:focus:ring-gray-100/50 focus:border-gray-900 dark:focus:border-gray-100 transition-all duration-300"
                                />
                            </div>
                        </form>

                        {/* Login Button - Mobile */}


                        {/* User Profile / Login - Mobile */}
                        {user ? (
                            <div className="flex sm:hidden items-center gap-3 w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl">
                                <div className="p-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-full text-white dark:text-gray-900">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground font-medium">Signed in as</span>
                                    <span className="font-bold text-base truncate">{user.name}</span>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex sm:hidden items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 text-white dark:text-gray-900 rounded-full hover:shadow-lg hover:shadow-gray-900/50 dark:hover:shadow-gray-100/50 transition-all duration-300 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                        )}

                    </div>
                )}
            </div>
        </nav>
    );
}
