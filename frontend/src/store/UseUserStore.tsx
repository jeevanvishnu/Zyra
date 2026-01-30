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
    signup: (data: SignupPayload) => Promise<void>;
    login: (data: LoginPayload) => Promise<void>;
    logout: (data: LogoutPlayoad) => Promise<void>
    fetchProducts: () => Promise<void>
    getAllProduct: (params?: { category?: string; minPrice?: string; maxPrice?: string; search?: string; sort?: string; page?: number; limit?: number }) => Promise<void>
    getProductById: (id: string) => Promise<void>
    addToCart: (product: Product) => void
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
        } catch (err: any) {
            set({ checkingAuth: false, user: null })
            toast.error(err?.response?.data?.message || 'An error occurred')
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

    addToCart: (product) => {
        set((state) => {
            const existingItem = state.cart.find((item) => item._id === product._id);
            if (existingItem) {
                toast.success(`Updated ${product.ProductName} quantity in cart`);
                return {
                    cart: state.cart.map((item) =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                };
            }
            toast.success(`Added ${product.ProductName} to cart`);
            return { cart: [...state.cart, { ...product, quantity: 1 }] };
        });
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
