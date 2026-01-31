import { create } from "zustand"
import toast from "react-hot-toast"
import axios from '../lib/axios'

interface Product {
    _id?: string;
    ProductName: string;
    images: string[];
    price: number;
    stock: number;
    description: string;
    category: string;
    isActive: boolean;
}
interface AuthStore {
    user: any,
    isLoading: boolean;
    checkingAuth: boolean,
    products: Product[],
    pagination: {
        currentPage: number;
        totalPages: number;
        totalProducts: number;
    },
    currentProduct: Product | null,
    cart: (Product & { quantity: number })[],
    checkAuth: () => Promise<void>
    signup: (data: any) => Promise<void>;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>
    fetchProducts: () => Promise<void>
    getAllProduct: (params?: { category?: string; minPrice?: string; maxPrice?: string; search?: string; sort?: string; page?: number; limit?: number }) => Promise<void>
    getProductById: (id: string) => Promise<void>
    addToCart: (product: Product) => Promise<void>
    getCartProducts: () => Promise<void>
    updateQuantity: (productId: string, quantity: number) => Promise<void>
    removeFromCart: (productId: string) => Promise<void>
    clearCart: () => Promise<void>
    refreshToken: () => Promise<void>
}

export const userAuthStore = create<AuthStore>((set) => ({
    user: null,
    isLoading: false,
    checkingAuth: false,
    products: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0
    },
    currentProduct: null,
    cart: [],

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ isLoading: true })

        if (password !== confirmPassword) {
            set({ isLoading: false })
            toast.error("password doesn't match")
        }
        try {
            const res = await axios.post('/api/auth/signup', { name, email, password })
            set({ user: res.data, isLoading: false })
            toast.success("Signup successful")
        } catch (error: any) {
            set({ isLoading: false })
            toast.error(error?.response?.data?.message)
        }
    },

    login: async ({ email, password }) => {
        set({ isLoading: true })

        try {
            const res = await axios.post('/api/auth/login', { email, password })
            console.log(res);

            set({ user: res?.data, isLoading: false })
            toast.success("Login successful")
            userAuthStore.getState().getCartProducts()
            return res.data
        } catch (error: any) {
            set({ isLoading: false })
            toast.error(error?.response?.data?.message)
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true })

        try {
            const res = await axios.get('/api/auth/profile')
            set({ user: res.data, checkingAuth: false })
            userAuthStore.getState().getCartProducts()
        } catch (err: any) {
            set({ checkingAuth: false, user: null })
        }
    },
    logout: async () => {
        console.log("inside")
        try {
            await axios.post('/api/auth/logout')
            set({ user: null })
            toast.success("Logout sucessfull")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred")
        }
    },

    fetchProducts: async () => {
        try {
            const res = await axios.get('/api')
            set({ products: res?.data })
            return res.data
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred")
        }
    },
    getAllProduct: async (params = {}) => {
        try {
            const { category, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = params;

            // Filter out empty or "All" values
            const queryParams = new URLSearchParams();
            if (category && category !== "All") queryParams.append("category", category);
            if (minPrice) queryParams.append("minPrice", minPrice);
            if (maxPrice) queryParams.append("maxPrice", maxPrice);
            if (search) queryParams.append("search", search);
            if (sort) queryParams.append("sort", sort);
            queryParams.append("page", page.toString());
            queryParams.append("limit", limit.toString());

            const res = await axios.get(`/api/all?${queryParams.toString()}`)
            set({
                products: res?.data?.products || [],
                pagination: {
                    currentPage: res?.data?.currentPage || 1,
                    totalPages: res?.data?.totalPages || 1,
                    totalProducts: res?.data?.totalProducts || 0
                }
            })
            return res.data
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred")
        }
    },

    refreshToken: async () => {
        try {
            set({ checkingAuth: true })

            const res = await axios.post('/api/auth/refresh-token')
            set({ checkingAuth: false })
            return res.data
        } catch (error: any) {
            set({ checkingAuth: false, user: null })
            toast.error(error?.response?.data?.message || 'An error occurred')
        }
    },

    getProductById: async (id) => {
        set({ isLoading: true })
        try {
            const res = await axios.get(`/api/${id}`)
            set({ currentProduct: res.data, isLoading: false })
        } catch (error: any) {
            set({ isLoading: false, currentProduct: null })
            toast.error(error?.response?.data?.message || "Failed to fetch product details")
        }
    },

    getCartProducts: async () => {
        try {
            const res = await axios.get("/api/cart");
            const transformedCart = res.data.map((item: any) => ({
                ...item.product,
                quantity: item.quantity
            }));
            set({ cart: transformedCart });
        } catch (error: any) {
            set({ cart: [] });
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    addToCart: async (product) => {
        try {
            await axios.post("/api/cart", { productId: product._id });
            toast.success("Added to cart");

            set((state) => {
                const existingItem = state.cart.find((item) => item._id === product._id);
                if (existingItem) {
                    return {
                        cart: state.cart.map((item) =>
                            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                        ),
                    };
                }
                return { cart: [...state.cart, { ...product, quantity: 1 }] };
            });
        } catch (error: any) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    removeFromCart: async (productId) => {
        try {
            await axios.delete(`/api/cart`, { data: { productId } });
            set((state) => ({ cart: state.cart.filter((item) => item._id !== productId) }));
            toast.success("Removed from cart");
        } catch (error: any) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    updateQuantity: async (productId, quantity) => {
        try {
            if (quantity === 0) {
                userAuthStore.getState().removeFromCart(productId);
                return;
            }

            await axios.put(`/api/cart/${productId}`, { quantity });
            set((state) => ({
                cart: state.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
            }));
        } catch (error: any) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    clearCart: async () => {
        try {
            await axios.delete("/api/cart");
            set({ cart: [] });
        } catch (error: any) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },


}))


let refreshPromise: Promise<void> | null = null;

axios.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = userAuthStore.getState().refreshToken();
                }

                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
            } catch (err) {
                refreshPromise = null;
                userAuthStore.getState().logout();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);
