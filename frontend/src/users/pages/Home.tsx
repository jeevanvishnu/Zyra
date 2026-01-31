import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { userAuthStore } from '@/store/UseUserStore';



export default function Home() {
    const { products, fetchProducts, banners, getBanners } = userAuthStore();

    useEffect(() => {
        fetchProducts();
        getBanners();
    }, [fetchProducts, getBanners]);

    const activeBanner = banners[0];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Dynamic Hero Banner */}
            <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-gray-900 text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                    style={{
                        backgroundImage: `url('${activeBanner?.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop'}')`,
                        opacity: 0.4
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-in slide-in-from-bottom duration-700 uppercase">
                        {activeBanner?.title || 'Wear the Experience'}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-700 delay-100">
                        {activeBanner?.description || 'Discover the new collection. Minimalist design meets maximum comfort.'}
                    </p>
                    <div className="pt-4 animate-in slide-in-from-bottom duration-700 delay-200">
                        <Link
                            to={activeBanner?.link || "/products"}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-xl"
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
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
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
