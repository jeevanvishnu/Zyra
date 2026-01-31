import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAuthStore } from "@/store/UseUserStore";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentOrder, getOrderById, isLoading } = userAuthStore();

    useEffect(() => {
        if (id) {
            getOrderById(id);
        }
    }, [id]);

    if (isLoading || !currentOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    const steps = [
        { id: 'processing', label: 'Processing', icon: Clock },
        { id: 'shipped', label: 'Shipped', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(step => step.id === currentOrder.orderStatus);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Orders
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                            <h1 className="text-2xl font-bold">#{currentOrder._id.toUpperCase()}</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date Placed</p>
                            <p className="font-bold">{new Date(currentOrder.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                        </div>
                    </div>

                    {/* Status Tracker */}
                    <div className="p-8 bg-gray-50/50">
                        <div className="flex justify-between relative">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                            <div
                                className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStepIndex;
                                const isActive = index === currentStepIndex;

                                return (
                                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-black text-white' : 'bg-white border-2 border-gray-200 text-gray-400'
                                            } ${isActive ? 'ring-4 ring-black/10' : ''}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <p className={`text-xs font-bold mt-2 ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border-t border-gray-100">
                        {/* Order Items */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Package className="w-5 h-5" /> Items ordered
                            </h2>
                            <div className="space-y-4">
                                {currentOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm leading-tight">{item.name}</h3>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                                                <p className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary & Shipping */}
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-6 rounded-2xl">
                                <h3 className="font-bold mb-4">Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{currentOrder.totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                                        <span>Total</span>
                                        <span>₹{currentOrder.totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment Method</p>
                                    <p className="text-sm font-bold uppercase">{currentOrder.paymentMethod}</p>
                                    <p className={`text-xs font-bold mt-1 ${currentOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                        Payment {currentOrder.paymentStatus.charAt(0).toUpperCase() + currentOrder.paymentStatus.slice(1)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <Truck className="w-4 h-4" /> Shipping Address
                                </h3>
                                <div className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-100 p-4 rounded-xl">
                                    <p className="font-bold text-black">{currentOrder.shippingAddress.street}</p>
                                    <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}</p>
                                    <p>{currentOrder.shippingAddress.country}</p>
                                    <p className="mt-2 text-xs font-bold text-gray-400 uppercase">Phone: {currentOrder.shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
