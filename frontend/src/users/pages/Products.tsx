import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { userAuthStore } from '../../store/UseUserStore';

const CATEGORIES = ["All", "Clothing", "Outerwear", "Footwear", "Accessories"];
const PRICE_RANGES = ["All", "₹0 - ₹500", "₹500 - ₹2000", "₹2000 - ₹5000", "₹5000+"];

const ProductsPage = () => {
    const { getAllProduct, products, pagination } = userAuthStore();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [sortBy, setSortBy] = useState("featured");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchItems = async () => {
            let minPrice = "";
            let maxPrice = "";

            if (selectedPrice === "₹0 - ₹500") {
                minPrice = "0";
                maxPrice = "500";
            } else if (selectedPrice === "₹500 - ₹2000") {
                minPrice = "500";
                maxPrice = "2000";
            } else if (selectedPrice === "₹2000 - ₹5000") {
                minPrice = "2000";
                maxPrice = "5000";
            } else if (selectedPrice === "₹5000+") {
                minPrice = "5000";
            }

            let sort = "";
            if (sortBy === "Price: Low to High") sort = "price_asc";
            else if (sortBy === "Price: High to Low") sort = "price_desc";
            else if (sortBy === "Newest Arrivals") sort = "newest";

            await getAllProduct({
                category: selectedCategory,
                minPrice,
                maxPrice,
                sort,
                search: searchQuery,
                page: pagination.currentPage,
            });
        };

        fetchItems();
    }, [selectedCategory, selectedPrice, sortBy, pagination.currentPage, searchQuery]);

    const handlePageChange = (newPage: number) => {
        getAllProduct({
            category: selectedCategory,
            page: newPage
        });
    };

    const showingStart = (pagination.currentPage - 1) * 10 + 1;
    const showingEnd = Math.min(pagination.currentPage * 10, pagination.totalProducts);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">All Products</h1>
                        <p className="text-muted-foreground mt-1">
                            Showing {showingStart}-{showingEnd} of {pagination.totalProducts} products
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            className="md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card text-foreground"
                            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        >
                            <Filter size={20} />
                            Filters
                        </button>
                        <div className="relative group w-full md:w-48">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full appearance-none bg-card border border-border text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="featured">Sort by: Featured</option>
                                <option value="Price: Low to High">Price: Low to High</option>
                                <option value="Price: High to Low">Price: High to Low</option>
                                <option value="Newest Arrivals">Newest Arrivals</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`lg:w-64 space-y-8 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        {/* Categories */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Category</h3>
                            <div className="space-y-2">
                                {CATEGORIES.map((category: string) => (
                                    <label key={category} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === category}
                                            onChange={() => setSelectedCategory(category)}
                                            className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                                        />
                                        <span className={`text-sm ${selectedCategory === category ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                            {category}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Price Range</h3>
                            <div className="space-y-2">
                                {PRICE_RANGES.map((price: string) => (
                                    <label key={price} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="price"
                                            checked={selectedPrice === price}
                                            onChange={() => setSelectedPrice(price)}
                                            className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                                        />
                                        <span className={`text-sm ${selectedPrice === price ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                            {price}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted-foreground">No products found matching your criteria.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination UI */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <nav className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 text-foreground"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    {[...Array(pagination.totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${pagination.currentPage === index + 1
                                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                                : 'border border-border text-foreground hover:bg-muted'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 text-foreground"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
