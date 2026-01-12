import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

// Mock Data
const PRODUCTS = [
    {
        id: '1',
        name: "Classic Monochrome Tee",
        price: 35.00,
        description: "Premium cotton t-shirt in our signature black and white style. Perfect for everyday wear.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        rating: 4.5
    },
    {
        id: '2',
        name: "Urban Cargo Jacket",
        price: 120.00,
        description: "Multi-pocket cargo jacket designed for functionality and modern urban aesthetics.",
        image: "https://images.unsplash.com/photo-1551028919-ac7675cf5063?q=80&w=800&auto=format&fit=crop",
        rating: 4.8
    },
    {
        id: '3',
        name: "Minimalist Sneakers",
        price: 89.99,
        description: "Clean lines and superior comfort. The essential white sneaker for your rotation.",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
        rating: 4.2
    },
    {
        id: '4',
        name: "Tech Fleece Hoodie",
        price: 75.00,
        description: "Advanced fleece material providing warmth without the bulk. Athletic cut.",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
        rating: 4.6
    }
];

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Banner Banner */}
            <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-gray-900 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-in slide-in-from-bottom duration-700">
                        WEAR THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">EXPERIENCE</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-700 delay-100">
                        Discover the new collection. Minimalist design meets maximum comfort.
                    </p>
                    <div className="pt-4 animate-in slide-in-from-bottom duration-700 delay-200">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transform hover:scale-105 transition-all"
                        >
                            Shop Collection <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
                        <p className="text-muted-foreground mt-2">Hand-picked selections for you.</p>
                    </div>
                    <Link to="/products" className="hidden sm:flex items-center gap-1 font-semibold hover:underline">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-10 sm:hidden text-center">
                    <Link to="/products" className="inline-flex items-center gap-1 font-semibold hover:underline">
                        View all products <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
