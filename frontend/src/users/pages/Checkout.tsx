import { useState, useEffect } from "react";
import { userAuthStore } from "@/store/UseUserStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import {
    Loader2,
    CreditCard,
    Truck,
    Banknote,
    MapPin,
    ShoppingBag,
    CheckCircle2,
    ArrowRight,
    Plus,
    Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const CheckoutForm = () => {
    const { cart, addresses, getAddresses, updateAddress } = userAuthStore();
    const { placeOrder, verifyPayment, loading } = useOrderStore();
    const navigate = useNavigate();
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        getAddresses();
    }, []);

    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        phone: ""
    });

    const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe" | "razorpay">("cod");
    const [clientSecret, setClientSecret] = useState("");
    const [orderId, setOrderId] = useState("");

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async () => {
        if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.phone) {
            toast.error("Please fill in all details");
            return;
        }

        if (editingAddressId) {
            await updateAddress(editingAddressId, { ...shippingAddress, isDefault: false });
            setEditingAddressId(null);
            setShowAddressForm(false);
            setShippingAddress({ street: "", city: "", state: "", zipCode: "", country: "India", phone: "" });
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.phone) {
            toast.error("Please select or add a shipping address");
            return;
        }

        try {
            const data = await placeOrder({
                shippingAddress,
                paymentMethod
            });

            if (paymentMethod === "cod") {
                setOrderSuccess(true);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else if (paymentMethod === "stripe") {
                setClientSecret(data.clientSecret);
                setOrderId(data.orderId);
            } else if (paymentMethod === "razorpay") {
                handleRazorpayPayment(data);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleRazorpayPayment = (data: any) => {
        const options = {
            key: data.key,
            amount: data.amount * 100,
            currency: data.currency,
            name: "Zyra Store",
            description: "Order Payment",
            order_id: data.razorpayOrderId,
            handler: async (response: any) => {
                try {
                    await verifyPayment({
                        orderId: data.orderId,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature
                    });
                    setOrderSuccess(true);
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                } catch (error) {
                    toast.error("Payment verification failed");
                }
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: shippingAddress.phone
            },
            theme: {
                color: "#000000"
            }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-green-100"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Order Placed! 🎉
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Thank you for shopping with us. Your order is on its way!
                    </p>
                    <button
                        onClick={() => navigate("/account?tab=orders")}
                        className="w-full py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        View My Orders
                    </button>
                </motion.div>
            </div>
        );
    }

    const isAddressSelected = shippingAddress.street && shippingAddress.zipCode;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                        Checkout
                    </h1>
                    <p className="text-gray-600">Complete your purchase in a few simple steps</p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-4 mb-12 max-w-2xl mx-auto"
                >
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center gap-4">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${currentStep >= step
                                        ? "bg-gradient-to-br from-black to-gray-700 text-white shadow-lg scale-110"
                                        : "bg-gray-200 text-gray-400"
                                    }`}
                            >
                                {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                            </div>
                            {step < 3 && (
                                <div className={`w-16 h-1 rounded-full transition-all ${currentStep > step ? "bg-black" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <MapPin className="w-6 h-6" />
                                    Shipping Address
                                </h2>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Saved Addresses */}
                                {addresses.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr) => (
                                            <motion.div
                                                key={addr._id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setShippingAddress({
                                                        street: addr.street,
                                                        city: addr.city,
                                                        state: addr.state,
                                                        zipCode: addr.zipCode,
                                                        country: addr.country,
                                                        phone: addr.phone
                                                    });
                                                    setShowAddressForm(false);
                                                }}
                                                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 ${shippingAddress.street === addr.street && shippingAddress.zipCode === addr.zipCode
                                                        ? "bg-gradient-to-br from-black to-gray-800 text-white shadow-2xl"
                                                        : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <MapPin className={`w-5 h-5 ${shippingAddress.street === addr.street && shippingAddress.zipCode === addr.zipCode ? "text-white" : "text-gray-400"}`} />
                                                    {shippingAddress.street === addr.street && shippingAddress.zipCode === addr.zipCode && (
                                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                    )}
                                                </div>
                                                <p className={`font-bold mb-1 ${shippingAddress.street === addr.street && shippingAddress.zipCode === addr.zipCode ? "text-white" : "text-gray-900"}`}>
                                                    {addr.street}
                                                </p>
                                                <p className={`text-sm ${shippingAddress.street === addr.street && shippingAddress.zipCode === addr.zipCode ? "text-gray-300" : "text-gray-600"}`}>
                                                    {addr.city}, {addr.state} {addr.zipCode}
                                                </p>
                                                <p className={`text-sm ${shippingAddress.street === addr.street && shippingAddress.zipCode === addr.zipCode ? "text-gray-300" : "text-gray-600"}`}>
                                                    📞 {addr.phone}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Address Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setShowAddressForm(!showAddressForm);
                                        setShippingAddress({ street: "", city: "", state: "", zipCode: "", country: "India", phone: "" });
                                    }}
                                    className="w-full p-5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-black transition-all flex items-center justify-center gap-2 font-bold text-gray-700 hover:text-black"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add New Address
                                </motion.button>

                                {/* Address Form */}
                                <AnimatePresence>
                                    {showAddressForm && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="space-y-4 overflow-hidden"
                                        >
                                            <input
                                                type="text"
                                                name="street"
                                                placeholder="Street Address"
                                                value={shippingAddress.street}
                                                onChange={handleInputChange}
                                                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder="City"
                                                    value={shippingAddress.city}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all"
                                                />
                                                <input
                                                    type="text"
                                                    name="state"
                                                    placeholder="State"
                                                    value={shippingAddress.state}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    placeholder="ZIP Code"
                                                    value={shippingAddress.zipCode}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all"
                                                />
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    placeholder="Phone Number"
                                                    value={shippingAddress.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Payment Method */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <CreditCard className="w-6 h-6" />
                                    Payment Method
                                </h2>
                            </div>

                            <div className="p-6 space-y-4">
                                {[
                                    { value: "cod", label: "Cash on Delivery", icon: <Banknote className="w-6 h-6" />, gradient: "from-green-500 to-emerald-600" },
                                    { value: "stripe", label: "Stripe", icon: <CreditCard className="w-6 h-6" />, gradient: "from-purple-500 to-pink-600" },
                                    { value: "razorpay", label: "Razorpay", icon: <CreditCard className="w-6 h-6" />, gradient: "from-blue-500 to-cyan-600" }
                                ].map((method) => (
                                    <motion.label
                                        key={method.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === method.value
                                                ? `bg-gradient-to-r ${method.gradient} text-white shadow-2xl`
                                                : "bg-gray-50 hover:bg-gray-100 border-2 border-gray-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.value}
                                                checked={paymentMethod === method.value}
                                                onChange={() => setPaymentMethod(method.value as any)}
                                                className="w-5 h-5 accent-white"
                                            />
                                            <span className="font-bold text-lg">{method.label}</span>
                                        </div>
                                        <div className={paymentMethod === method.value ? "text-white" : "text-gray-400"}>
                                            {method.icon}
                                        </div>
                                    </motion.label>
                                ))}
                            </div>
                        </motion.div>

                        {/* Place Order Button or Stripe Form */}
                        {!clientSecret ? (
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                onClick={handlePlaceOrder}
                                disabled={loading || !isAddressSelected}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-6 bg-gradient-to-r from-black via-gray-800 to-black text-white rounded-2xl font-black text-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6" />
                                        Place Order
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? (
                                <div className="p-6 bg-red-100 text-red-700 rounded-2xl font-bold">
                                    Error: Stripe Publishable Key is missing in frontend .env file.
                                </div>
                            ) : (
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <StripePaymentForm orderId={orderId} setOrderSuccess={setOrderSuccess} />
                                </Elements>
                            )
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="lg:sticky lg:top-24 h-fit"
                    >
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6" />
                                    Order Summary
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                                    {cart.map((item) => (
                                        <div key={item._id} className="flex gap-4 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md flex-shrink-0">
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.ProductName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-sm line-clamp-2 mb-1">{item.ProductName}</h3>
                                                <p className="text-sm text-gray-500 mb-1">Qty: {item.quantity}</p>
                                                <p className="font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t-2 border-gray-100">
                                    <div className="flex justify-between text-gray-600">
                                        <span className="font-medium">Subtotal</span>
                                        <span className="font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="font-medium">Shipping</span>
                                        <span className="text-green-600 font-bold">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-black pt-3 border-t-2 border-gray-100">
                                        <span>Total</span>
                                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            ₹{totalAmount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Stripe Payment Component
const StripePaymentForm = ({ orderId, setOrderSuccess }: { orderId: string, setOrderSuccess: (val: boolean) => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { verifyPayment } = useOrderStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/payment-success",
            },
            redirect: "if_required",
        });

        if (error) {
            toast.error(error.message || "Payment failed");
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            try {
                await verifyPayment({
                    orderId,
                    paymentId: paymentIntent.id
                });

                setOrderSuccess(true);
                toast.success("Payment successful!");

            } catch (err) {
                toast.error("Verification failed");
            }
            setIsProcessing(false);
        }
    };

    return (
        <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-xl"
        >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Card Details
            </h3>
            <div className="p-5 border-2 border-gray-200 rounded-2xl mb-6 bg-gray-50">
                <PaymentElement />
            </div>
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg disabled:opacity-50 flex justify-center items-center gap-2 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Pay ₹{/* Amount would go here */} Now</>}
            </button>
        </motion.form>
    );
};

export default CheckoutForm;
