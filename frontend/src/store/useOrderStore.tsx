import { create } from "zustand";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

interface OrderStore {
    loading: boolean;
    placeOrder: (orderData: any) => Promise<any>;
    verifyPayment: (paymentData: any) => Promise<any>;
}

export const useOrderStore = create<OrderStore>((set) => ({
    loading: false,

    placeOrder: async (orderData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/api/orders/place-order", orderData);
            set({ loading: false });
            return res.data;
        } catch (error: any) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to place order");
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/api/orders/verify-payment", paymentData);
            set({ loading: false });
            return res.data;
        } catch (error: any) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Payment verification failed");
            throw error;
        }
    },
}));
