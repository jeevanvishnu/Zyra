import { useState, useEffect } from "react";
import { userAuthStore } from "../../store/UseUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, MapPin, LogOut, Plus, Trash2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AccountPage = () => {
    const {
        user, logout, orders, addresses, getOrders, getAddresses,
        addAddress, deleteAddress, updateProfile, orderPagination
    } = userAuthStore();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "orders" || tab === "addresses" || tab === "profile") {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: "", city: "", state: "", zipCode: "", country: "India", phone: "", isDefault: false
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        if (activeTab === 'orders') getOrders();
        if (activeTab === 'addresses') getAddresses();
    }, [activeTab]);

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name || "", email: user.email || "", password: "" });
        }
    }, [user, isEditingProfile]);

    const handleLogout = () => {
        logout();
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = { name: profileData.name, email: profileData.email };
        if (profileData.password) data.password = profileData.password;
        await updateProfile(data);
        setIsEditingProfile(false);
        setProfileData(prev => ({ ...prev, password: "" }));
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        await addAddress(newAddress);
        setIsAddingAddress(false);
        setNewAddress({ street: "", city: "", state: "", zipCode: "", country: "India", phone: "", isDefault: false });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">{user?.name}</h2>
                                <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <User className="w-5 h-5" /> Profile
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <Package className="w-5 h-5" /> My Orders
                            </button>
                            <button
                                onClick={() => setActiveTab("addresses")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                            >
                                <MapPin className="w-5 h-5" /> Addresses
                            </button>
                            <div className="h-px bg-gray-100 my-4" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
                            >
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Profile Details</h1>
                                    {!isEditingProfile && (
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            className="text-sm font-medium underline text-gray-600 hover:text-black"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {isEditingProfile ? (
                                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password (optional)</label>
                                            <input
                                                type="password"
                                                value={profileData.password}
                                                onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                                                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingProfile(false)}
                                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6 max-w-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input type="text" value={user?.name || ""} disabled className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input type="email" value={user?.email || ""} disabled className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'orders' && (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Order History</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Total: {orderPagination.totalOrders}</span>
                                    </div>
                                </div>
                                {orders.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>No orders found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order._id}
                                                onClick={() => navigate(`/order/${order._id}`)}
                                                className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group"
                                            >
                                                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                                                        <p className="font-mono font-bold text-sm group-hover:text-black transition-colors">#{order._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                                                        <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                                        <p className="font-bold text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                                    </div>
                                                    <div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="space-y-2">
                                                        {order.items.slice(0, 2).map((item: any, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm">
                                                                <span className="text-gray-600">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                                                <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                            </div>
                                                        ))}
                                                        {order.items.length > 2 && (
                                                            <p className="text-xs text-gray-400 mt-1">+ {order.items.length - 2} more items</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <span className="text-sm font-bold underline opacity-0 group-hover:opacity-100 transition-opacity">View Full Details</span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Pagination Controls */}
                                        {orderPagination.totalPages > 1 && (
                                            <div className="flex justify-center items-center gap-4 pt-6">
                                                <button
                                                    disabled={orderPagination.currentPage === 1}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        getOrders({ page: orderPagination.currentPage - 1 })
                                                    }}
                                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                                >
                                                    Previous
                                                </button>
                                                <span className="text-sm font-medium">
                                                    Page {orderPagination.currentPage} of {orderPagination.totalPages}
                                                </span>
                                                <button
                                                    disabled={orderPagination.currentPage === orderPagination.totalPages}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        getOrders({ page: orderPagination.currentPage + 1 })
                                                    }}
                                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'addresses' && (
                            <motion.div
                                key="addresses"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Address Book</h1>
                                    <button
                                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add New
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {isAddingAddress && (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            onSubmit={handleAddAddress}
                                            className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200 overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <input required placeholder="Street Address" className="p-3 rounded-lg border" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                                                <input required placeholder="City" className="p-3 rounded-lg border" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                                <input required placeholder="State" className="p-3 rounded-lg border" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                                                <input required placeholder="ZIP Code" className="p-3 rounded-lg border" value={newAddress.zipCode} onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })} />
                                                <input required placeholder="Phone Number" className="p-3 rounded-lg border" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
                                                <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg">Save Address</button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div key={addr._id} className="border border-gray-200 rounded-xl p-5 relative group hover:border-black transition-colors">
                                            {addr.isDefault && <span className="absolute top-4 right-4 text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">Default</span>}
                                            <div className="pr-8">
                                                <p className="font-bold mb-1">{addr.street}</p>
                                                <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode}</p>
                                                <p className="text-sm text-gray-600">{addr.country}</p>
                                                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"><span className="text-xs uppercase font-bold">Phone:</span> {addr.phone}</p>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => deleteAddress(addr._id!)} className="text-red-500 text-sm font-medium flex items-center gap-1 hover:underline">
                                                    <Trash2 className="w-3 h-3" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && !isAddingAddress && (
                                        <div className="col-span-full text-center py-8 text-gray-400">
                                            No addresses saved yet.
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AccountPage;
