import { Search, Filter, Eye, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { userAuthStore } from "../../store/UseUserStore";

const Orders = () => {
    const { adminOrders, adminOrderPagination, adminGetOrders, adminUpdateOrderStatus, isLoading } = userAuthStore();

    useEffect(() => {
        adminGetOrders({ page: 1, limit: 10 });
    }, []);

    const handlePageChange = (newPage: number) => {
        adminGetOrders({ page: newPage, limit: 10 });
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-600">
                        <Filter size={20} />
                        Filter
                    </button>
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
                                        <td className="p-4 font-medium text-gray-900">#ORD-{item._id.slice(-6).toUpperCase()}</td>
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
                                                className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-black/5 ${getStatusColor(item.orderStatus)}`}
                                            >
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
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
        </div>
    );
};

export default Orders;
