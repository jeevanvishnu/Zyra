import { Search, Filter, Eye, ChevronLeft, ChevronRight, Loader, X } from "lucide-react";
import { useEffect, useState } from "react";
import { userAuthStore } from "../../store/UseUserStore";

const Orders = () => {
    const { adminOrders, adminOrderPagination, adminGetOrders, adminUpdateOrderStatus, isLoading } = userAuthStore();
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        adminGetOrders({ page: 1, limit: 10, search: debouncedSearch });
    }, [debouncedSearch]);

    const handlePageChange = (newPage: number) => {
        adminGetOrders({ page: newPage, limit: 10, search: debouncedSearch });
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        await adminUpdateOrderStatus(id, newStatus);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-indigo-100 text-indigo-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const isStatusDisabled = (currentStatus: string, optionStatus: string) => {
        if (currentStatus === 'delivered' || currentStatus === 'cancelled') return true;
        if (currentStatus === 'shipped' && optionStatus === 'processing') return true;
        if (currentStatus === optionStatus) return false; // Not disabled if it's the current one
        return false;
    };

    return (
        <div className="space-y-6 text-gray-900">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Orders</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders by ID or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {adminOrders.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium">#ORD-{item._id.slice(-6).toUpperCase()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">
                                                    {(item.user as any)?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <span className="text-gray-700">{(item.user as any)?.name || 'Guest'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                                        <td className="p-4">
                                            <select
                                                value={item.orderStatus}
                                                onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                                disabled={item.orderStatus === 'delivered' || item.orderStatus === 'cancelled'}
                                                className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed ${getStatusColor(item.orderStatus)}`}
                                            >
                                                <option value="processing" disabled={isStatusDisabled(item.orderStatus, 'processing')}>Processing</option>
                                                <option value="shipped" disabled={isStatusDisabled(item.orderStatus, 'shipped')}>Shipped</option>
                                                <option value="delivered" disabled={isStatusDisabled(item.orderStatus, 'delivered')}>Delivered</option>
                                                <option value="cancelled" disabled={isStatusDisabled(item.orderStatus, 'cancelled')}>Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedOrder(item)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                    <div>
                        Showing {(adminOrderPagination.currentPage - 1) * 10 + 1} to {Math.min(adminOrderPagination.currentPage * 10, adminOrderPagination.totalOrders)} of {adminOrderPagination.totalOrders} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(adminOrderPagination.currentPage - 1)}
                            disabled={adminOrderPagination.currentPage === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: adminOrderPagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${adminOrderPagination.currentPage === page
                                    ? 'bg-black text-white'
                                    : 'border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(adminOrderPagination.currentPage + 1)}
                            disabled={adminOrderPagination.currentPage === adminOrderPagination.totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Order Details</h3>
                                <p className="text-gray-500 text-sm">#ORD-{selectedOrder._id.toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-8">
                            {/* Customer & Shipping */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h4>
                                    <p className="font-medium text-gray-900">{(selectedOrder.user as any)?.name}</p>
                                    <p className="text-gray-600">{(selectedOrder.user as any)?.email}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</h4>
                                    <p className="text-gray-600">{selectedOrder.shippingAddress.street}</p>
                                    <p className="text-gray-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                                    <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                                    <p className="text-gray-600 font-medium mt-1">📞 {selectedOrder.shippingAddress.phone}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Items</h4>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                                            <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="text-right font-bold text-gray-900">
                                                ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals & Status */}
                            <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Payment Method:</span>
                                        <span className="text-sm font-bold uppercase">{selectedOrder.paymentMethod}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Payment Status:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                    <p className="text-3xl font-black text-gray-900">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
