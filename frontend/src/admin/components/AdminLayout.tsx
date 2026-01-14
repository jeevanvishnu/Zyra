import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Image as ImageIcon,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: ImageIcon, label: "Banners", path: "/admin/banners" },
];

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Navigate to admin login
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? "250px" : "80px" }}
                className="hidden md:flex flex-col bg-black text-white h-screen sticky top-0 shadow-xl z-20 overflow-hidden"
            >
                <div className="p-4 flex items-center justify-between h-16 border-b border-gray-800">
                    <motion.div
                        className="flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap"
                        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                    >
                        <span className="text-2xl">⚡</span>
                        <span>Admin</span>
                    </motion.div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
                    {sidebarItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative ${isActive
                                    ? "bg-white text-black shadow-lg shadow-white/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/10"
                                }`
                            }
                        >
                            <item.icon
                                size={22}
                                className="shrink-0 transition-transform group-hover:scale-110"
                            />
                            <motion.span
                                animate={{
                                    opacity: isSidebarOpen ? 1 : 0,
                                    width: isSidebarOpen ? "auto" : 0,
                                }}
                                className="overflow-hidden whitespace-nowrap font-medium"
                            >
                                {item.label}
                            </motion.span>

                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors group"
                    >
                        <LogOut size={22} className="shrink-0 group-hover:rotate-180 transition-transform" />
                        <motion.span
                            animate={{
                                opacity: isSidebarOpen ? 1 : 0,
                                width: isSidebarOpen ? "auto" : 0,
                            }}
                            className="overflow-hidden whitespace-nowrap font-medium"
                        >
                            Sign Out
                        </motion.span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
                <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md">
                    <h1 className="text-xl font-bold text-gray-800">Overview</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                            A
                        </div>
                    </div>
                </header>
                <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
