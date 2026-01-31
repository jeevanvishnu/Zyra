import { Plus, Upload, Trash2, Image as ImageIcon, Loader, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { userAuthStore } from "../../store/UseUserStore";

const Banners = () => {
    const { banners, adminGetBanners, addBanner, deleteBanner, toggleBannerStatus, isLoading } = userAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBanner, setNewBanner] = useState({
        title: "",
        description: "",
        image: "",
        link: "",
        location: "homepage"
    });

    useEffect(() => {
        adminGetBanners();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewBanner({ ...newBanner, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addBanner(newBanner);
        setIsModalOpen(false);
        setNewBanner({ title: "", description: "", image: "", link: "", location: "homepage" });
    };

    return (
        <div className="space-y-6 text-gray-900">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Banners</h2>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
                >
                    <Plus size={20} />
                    Add Banner
                </motion.button>
            </div>

            {isLoading && banners.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <Loader className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="aspect-video bg-gray-50 relative flex items-center justify-center overflow-hidden">
                                {banner.image ? (
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <ImageIcon size={48} className="text-gray-200" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => toggleBannerStatus(banner._id)}
                                        className={`p-3 rounded-xl transition-colors ${banner.isActive ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                        title={banner.isActive ? "Deactivate" : "Activate"}
                                    >
                                        <Upload size={20} />
                                    </button>
                                    <button
                                        onClick={() => deleteBanner(banner._id)}
                                        className="p-3 bg-red-500 rounded-xl text-white hover:bg-red-600 shadow-lg"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg">{banner.title}</h3>
                                        <p className="text-sm text-gray-500">{banner.location}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${banner.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${banner.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                            {banner.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                {banner.description && (
                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{banner.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Banner Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-xl font-bold">Create New Banner</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Banner Title</label>
                                        <input
                                            required
                                            type="text"
                                            value={newBanner.title}
                                            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none"
                                            placeholder="e.g. Summer Sale 2024"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={newBanner.description}
                                            onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none resize-none h-24"
                                            placeholder="Banner tagline or details..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Target Link</label>
                                            <input
                                                type="text"
                                                value={newBanner.link}
                                                onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none"
                                                placeholder="/products"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                            <select
                                                value={newBanner.location}
                                                onChange={(e) => setNewBanner({ ...newBanner, location: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none appearance-none bg-white"
                                            >
                                                <option value="homepage">Homepage</option>
                                                <option value="sidebar">Sidebar</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
                                        <div className="relative group/upload">
                                            <input
                                                required
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="banner-image-upload"
                                            />
                                            <label
                                                htmlFor="banner-image-upload"
                                                className="block w-full border-2 border-dashed border-gray-200 hover:border-black/20 rounded-2xl p-8 text-center cursor-pointer transition-all bg-gray-50 group-hover/upload:bg-gray-100"
                                            >
                                                {newBanner.image ? (
                                                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                                                        <img src={newBanner.image} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <Upload size={24} className="text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <Upload className="mx-auto text-gray-400" size={32} />
                                                        <p className="text-sm font-medium text-gray-500">Click to upload banner image</p>
                                                        <p className="text-xs text-gray-400">Recommended size: 1920x600</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                >
                                    {isLoading ? <Loader className="animate-spin" size={20} /> : <Plus size={20} />}
                                    Create Banner
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Banners;
