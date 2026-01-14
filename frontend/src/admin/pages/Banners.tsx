import { Plus, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const Banners = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Banners</h2>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} />
                    Add Banner
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                            <ImageIcon size={48} className="text-gray-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button className="p-2 bg-white rounded-lg text-gray-900 hover:bg-gray-100">
                                    <Upload size={20} />
                                </button>
                                <button className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900">Summer Sale Banner</h3>
                                    <p className="text-sm text-gray-500">Main Homepage</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-xs text-gray-500 font-medium">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banners;
