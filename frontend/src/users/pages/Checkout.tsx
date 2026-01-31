import { useState, useEffect } from "react";
import { userAuthStore } from "@/store/UseUserStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Loader2, CreditCard, Truck, Banknote } from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

// Replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const CheckoutForm = () => {
    const { cart, addresses, getAddresses, updateAddress } = userAuthStore();
    const { placeOrder, verifyPayment, loading } = useOrderStore();
    const navigate = useNavigate();
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        getAddresses();
    }, []);

    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

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
            setShippingAddress({ street: "", city: "", state: "", zipCode: "", country: "India", phone: "" });
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.phone) {
            toast.error("Please fill in all shipping details");
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Truck className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Order Placed Successfully! 🎉</h1>
                    <p className="text-gray-500 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
                    <button
                        onClick={() => navigate("/account?tab=orders")}
                        className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left: Shipping & Payment Form */}
                <div className="space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Truck className="w-5 h-5" /> Shipping Address
                        </h2>

                        {/* Saved Addresses Selection */}
                        {addresses.length > 0 && (
                            <div className="mb-6 space-y-3">
                                <p className="text-sm font-medium text-gray-700">Select Saved Address:</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {addresses.map((addr, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                if (editingAddressId !== addr._id) {
                                                    setShippingAddress({
                                                        street: addr.street,
                                                        city: addr.city,
                                                        state: addr.state,
                                                        zipCode: addr.zipCode,
                                                        country: addr.country,
                                                        phone: addr.phone
                                                    });
                                                    setEditingAddressId(null);
                                                }
                                            }}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative group ${shippingAddress.street === addr.street && shippingAddress.zipCode === addr.zipCode && !editingAddressId
                                                ? 'border-black bg-gray-50'
                                                : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-sm">{addr.street}</p>
                                                    <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                                                    <p className="text-xs text-gray-500">{addr.phone}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingAddressId(addr._id || null);
                                                        setShippingAddress({
                                                            street: addr.street,
                                                            city: addr.city,
                                                            state: addr.state,
                                                            zipCode: addr.zipCode,
                                                            country: addr.country,
                                                            phone: addr.phone
                                                        });
                                                    }}
                                                    className="text-xs font-bold underline text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => {
                                            setShippingAddress({ street: "", city: "", state: "", zipCode: "", country: "India", phone: "" });
                                            setEditingAddressId(null);
                                        }}
                                        className={`p-4 rounded-xl border-2 border-dashed cursor-pointer text-center text-sm font-medium transition-all ${!shippingAddress.street && !editingAddressId ? 'border-black text-black' : 'border-gray-200 text-gray-500 hover:border-gray-400'
                                            }`}
                                    >
                                        + Add New Address
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                value={shippingAddress.street}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={shippingAddress.city}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={shippingAddress.state}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="zipCode"
                                    placeholder="ZIP Code"
                                    value={shippingAddress.zipCode}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={shippingAddress.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                            {editingAddressId && (
                                <button
                                    onClick={handleSaveAddress}
                                    className="w-full py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all"
                                >
                                    Update Saved Address
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" /> Payment Method
                        </h2>
                        <div className="space-y-4">
                            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="accent-black w-5 h-5"
                                    />
                                    <span className="font-medium">Cash on Delivery</span>
                                </div>
                                <Banknote className="w-5 h-5 text-gray-500" />
                            </label>

                            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="stripe"
                                        checked={paymentMethod === 'stripe'}
                                        onChange={() => setPaymentMethod('stripe')}
                                        className="accent-black w-5 h-5"
                                    />
                                    <span className="font-medium">Stripe</span>
                                </div>
                                <CreditCard className="w-5 h-5 text-gray-500" />
                            </label>

                            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="razorpay"
                                        checked={paymentMethod === 'razorpay'}
                                        onChange={() => setPaymentMethod('razorpay')}
                                        className="accent-black w-5 h-5"
                                    />
                                    <span className="font-medium">Razorpay</span>
                                </div>
                                <CreditCard className="w-5 h-5 text-gray-500" />
                            </label>
                        </div>
                    </div>

                    {!clientSecret ? (
                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Place Order"}
                        </button>
                    ) : (
                        !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? (
                            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                                Error: Stripe Publishable Key is missing in frontend .env file.
                            </div>
                        ) : (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <StripePaymentForm orderId={orderId} setOrderSuccess={setOrderSuccess} />
                            </Elements>
                        )
                    )}
                </div>

                {/* Right: Order Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                        {cart.map((item) => (
                            <div key={item._id} className="flex gap-4">
                                <img src={item.images[0]} alt={item.ProductName} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm line-clamp-2">{item.ProductName}</h3>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    <p className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-100 mt-2">
                            <span>Total</span>
                            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stripe Payer Component
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
        <form onSubmit={handleSubmit} className="mt-4 bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Enter Card Details</h3>
            <div className="p-4 border border-gray-200 rounded-lg mb-4">
                <PaymentElement />
            </div>
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full py-3 bg-black text-white rounded-lg font-bold disabled:bg-gray-400 flex justify-center"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : "Pay Now"}
            </button>
        </form>
    );
};

export default CheckoutForm;
