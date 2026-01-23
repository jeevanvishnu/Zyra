import { useState } from 'react';
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

// Dummy Data
const DUMMY_PRODUCTS = [
    {
        _id: '1',
        ProductName: "Premium Cotton Tee",
        price: 35.00,
        description: "High-quality cotton t-shirt for everyday comfort.",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
        category: "Clothing"
    },
    {
        _id: '2',
        ProductName: "Urban Cargo Jacket",
        price: 120.00,
        description: "Stylish and functional cargo jacket for the modern explorer.",
        images: ["https://images.unsplash.com/photo-1551028919-ac7675cf5063?q=80&w=800&auto=format&fit=crop"],
        category: "Outerwear"
    },
    {
        _id: '3',
        ProductName: "Minimalist Sneakers",
        price: 89.99,
        description: "Clean design sneakers that go with everything.",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"],
        category: "Footwear"
    },
    {
        _id: '4',
        ProductName: "Tech Fleece Hoodie",
        price: 75.00,
        description: "Warm and breathable fleece hoodie for athletic activities.",
        images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"],
        category: "Clothing"
    },
    {
        _id: '5',
        ProductName: "Leather Crossbody Bag",
        price: 150.00,
        description: "Genuine leather bag perfect for daily essentials.",
        images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"],
        category: "Accessories"
    },
    {
        _id: '6',
        ProductName: "Classic Denim Jeans",
        price: 60.00,
        description: "Durable and stylish denim jeans with a perfect fit.",
        images: ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop"],
        category: "Clothing"
    },
];

const CATEGORIES = ["All", "Clothing", "Outerwear", "Footwear", "Accessories"];
const PRICE_RANGES = ["All", "$0 - $50", "$50 - $100", "$100 - $200", "$200+"];

const ProductsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">All Products</h1>
                        <p className="text-muted-foreground mt-1">Showing 1-6 of 24 products</p>
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
                            <select className="w-full appearance-none bg-card border border-border text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                <option>Sort by: Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest Arrivals</option>
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
                                {CATEGORIES.map((category) => (
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
                                {PRICE_RANGES.map((price) => (
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
                            {DUMMY_PRODUCTS.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Pagination UI */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-2">
                                <button className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 text-foreground">
                                    <ChevronLeft size={20} />
                                </button>
                                {[1, 2, 3, 4].map((page) => (
                                    <button
                                        key={page}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${page === 1
                                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                                : 'border border-border text-foreground hover:bg-muted'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <span className="text-muted-foreground px-2">...</span>
                                <button className="p-2 border border-border rounded-lg hover:bg-muted text-foreground">
                                    <ChevronRight size={20} />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
