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

interface Address {
    _id?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

interface Order {
    _id: string;
    items: any[];
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    paymentMethod: string;
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
    wishlist: Product[],
    orders: Order[],
    addresses: Address[],
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
    toggleWishlist: (productId: string) => Promise<void>
    getWishlist: () => Promise<void>
    refreshToken: () => Promise<void>
    getOrders: () => Promise<void>
    getAddresses: () => Promise<void>
    addAddress: (address: Address) => Promise<void>
    deleteAddress: (id: string) => Promise<void>
    updateProfile: (data: { name?: string; email?: string, password?: string }) => Promise<void>
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
    wishlist: [],

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
            userAuthStore.getState().getWishlist()
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
            userAuthStore.getState().getWishlist()
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
            const res = await axios.post("/api/cart", { productId: product._id });
            const { message, status } = res.data;

            if (status === "warning") {
                toast.error(message);
            } else {
                toast.success(message);
            }

            set((state) => {
                const existingItem = state.cart.find((item) => item._id === product._id);
                if (existingItem) {
                    return {
                        cart: state.cart.map((item) =>
                            item._id === product._id
                                ? { ...item, quantity: status === "warning" ? product.stock : item.quantity + 1 }
                                : item
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
            if (quantity <= 0) {
                userAuthStore.getState().removeFromCart(productId);
                return;
            }

            const res = await axios.put(`/api/cart/${productId}`, { quantity });
            const { message, status } = res.data;

            if (status === "warning") {
                toast.error(message);
            }

            set((state) => ({
                cart: state.cart.map((item) => {
                    if (item._id === productId) {
                        return {
                            ...item,
                            quantity: status === "warning" ? item.stock : quantity
                        };
                    }
                    return item;
                }),
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

    getWishlist: async () => {
        try {
            const res = await axios.get("/api/wishlist");
            set({ wishlist: res.data });
        } catch (error: any) {
            set({ wishlist: [] });
            console.error("Error in getWishlist store action", error);
        }
    },

    toggleWishlist: async (productId) => {
        try {
            await axios.post("/api/wishlist/toggle", { productId });
            await userAuthStore.getState().getWishlist();

            const isNowWishlisted = userAuthStore.getState().wishlist.some(p => p._id === productId);
            if (isNowWishlisted) {
                toast.success("Added to wishlist");
            } else {
                toast.success("Removed from wishlist");
            }
        } catch (error: any) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },


    orders: [],
    addresses: [],

    getOrders: async () => {
        try {
            const res = await axios.get("/api/orders");
            set({ orders: res.data });
        } catch (error: any) {
            console.error("Failed to fetch orders", error);
        }
    },

    getAddresses: async () => {
        try {
            const res = await axios.get("/api/user/address");
            set({ addresses: res.data });
        } catch (error: any) {
            console.error("Failed to fetch addresses", error);
        }
    },

    addAddress: async (address) => {
        try {
            const res = await axios.post("/api/user/address", address);
            set({ addresses: res.data });
            toast.success("Address added successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add address");
        }
    },

    deleteAddress: async (id) => {
        try {
            const res = await axios.delete(`/api/user/address/${id}`);
            set({ addresses: res.data });
            toast.success("Address deleted");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete address");
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axios.put("/api/user/profile", data);
            set({ user: { ...res.data } });
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    }

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
