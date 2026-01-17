import { Plus, Search, Filter, Edit, Trash2, X, Upload, ChevronLeft, ChevronRight, Image as Img } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/useProductStore";

const Products = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { products, addProduct, getAllProducts, loading } = useProductStore();

    useEffect(() => {
        getAllProducts()
    }, [])

    const itemsPerPage = 5;

    // Form state
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        isActive: true,
    });

    // Image upload state - store File objects instead of base64
    const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);
    const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Store the actual File object
            const newFiles = [...imageFiles];
            newFiles[index] = file;
            setImageFiles(newFiles);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...imagePreviews];
                newPreviews[index] = reader.result as string;
                setImagePreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFiles = [...imageFiles];
        newFiles[index] = null;
        setImageFiles(newFiles);

        const newPreviews = [...imagePreviews];
        newPreviews[index] = null;
        setImagePreviews(newPreviews);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.productName.trim()) {
            newErrors.productName = 'Product name is required';
        }

        if (!formData.price || Number(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (!formData.stock || Number(formData.stock) < 0) {
            newErrors.stock = 'Stock must be 0 or greater';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        const hasImages = imageFiles.some(file => file !== null);
        if (!hasImages) {
            newErrors.images = 'At least one image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            productName: '',
            price: '',
            stock: '',
            category: '',
            description: '',
            isActive: true,
        });
        setImageFiles([null, null, null]);
        setImagePreviews([null, null, null]);
        setErrors({});
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Create FormData object
        const data = new FormData();
        data.append('productName', formData.productName);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('isActive', String(formData.isActive));

        // Append all image files with the same field name 'image'
        imageFiles.forEach((file) => {
            if (file) {
                data.append('image', file);
            }
        });

        try {
            await addProduct(data);
            setIsAddModalOpen(false);
            resetForm();
        } catch (error) {
            // Error is handled in the store
            console.error('Failed to add product:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} />
                    Add Product
                </motion.button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-600">
                        <Filter size={20} />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                            {item.images && item.images.length > 0 ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.ProductName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Img size={20} />
                                                </div>
                                            )}

                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.ProductName}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{item.category}</td>
                                    <td className="p-4 font-medium">${item?.price?.toFixed(2)}</td>
                                    <td className="p-4 text-gray-600">{item.stock} in stock</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive === true
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>{item?.isActive === true ? "Active" : "UnActive"}
                                            {item?.isActive}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                    <div>
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, products.length)} of {products.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentPage === page
                                    ? 'bg-black text-white'
                                    : 'border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddProduct} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (Up to 3)</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[0, 1, 2].map((index) => (
                                                <div key={index} className="relative aspect-square">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(index, e)}
                                                        className="hidden"
                                                        id={`image-upload-${index}`}
                                                    />
                                                    <label
                                                        htmlFor={`image-upload-${index}`}
                                                        className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${imagePreviews[index]
                                                            ? 'border-transparent'
                                                            : errors.images ? 'border-red-300 hover:border-red-400' : 'border-gray-200 hover:border-black/20 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {imagePreviews[index] ? (
                                                            <>
                                                                <img
                                                                    src={imagePreviews[index] as string}
                                                                    alt={`Product ${index + 1}`}
                                                                    className="w-full h-full object-cover rounded-xl"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => removeImage(index, e)}
                                                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload size={24} className="mb-2 text-gray-400" />
                                                                <span className="text-xs text-gray-400">Image {index + 1}</span>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                        <input
                                            type="text"
                                            value={formData.productName}
                                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.productName ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-black/5`}
                                            placeholder="e.g. Premium Headphones"
                                        />
                                        {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className={`w-full pl-8 pr-4 py-2 rounded-lg border ${errors.price ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-black/5`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.stock ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-black/5`}
                                            placeholder="0"
                                        />
                                        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.category ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-black/5`}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="electronics">Electronics</option>
                                            <option value="clothing">Clothing</option>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={formData.isActive ? 'active' : 'draft'}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                        >
                                            <option value="active">Active</option>
                                            <option value="draft">UnActive</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.description ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-black/5`}
                                            placeholder="Product description..."
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50" disabled={loading}>Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                                        {loading ? 'Adding...' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;
