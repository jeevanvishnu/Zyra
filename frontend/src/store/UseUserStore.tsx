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
    user?: string | { _id: string; name: string; email: string };
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phone: string;
    };
}

export interface IBanner {
    _id: string;
    title: string;
    description?: string;
    image: string;
    link?: string;
    isActive: boolean;
    location: string;
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
    orderPagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
    },
    adminOrders: Order[];
    adminOrderPagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
    },
    currentOrder: Order | null,
    addresses: Address[],
    banners: IBanner[],
    dashboardStats: {
        totalOrders: number;
        totalRevenue: number;
        totalUsers: number;
        totalProducts: number;
    } | null,
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
    getOrderById: (id: string) => Promise<void>
    adminGetOrders: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>
    adminUpdateOrderStatus: (id: string, status: string) => Promise<void>
    getAdminStats: () => Promise<void>
    // Banners
    getBanners: () => Promise<void>
    adminGetBanners: () => Promise<void>
    addBanner: (data: any) => Promise<void>
    deleteBanner: (id: string) => Promise<void>
    toggleBannerStatus: (id: string) => Promise<void>
    getOrders: (params?: { page?: number; limit?: number }) => Promise<void>
    getAddresses: () => Promise<void>
    addAddress: (address: Address) => Promise<void>
    deleteAddress: (id: string) => Promise<void>
    updateAddress: (id: string, address: Address) => Promise<void>
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
    orders: [],
    orderPagination: {
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0
    },
    adminOrders: [],
    adminOrderPagination: {
        currentPage: 1,
        totalPages: 1,
        totalOrders: 0
    },
    currentOrder: null,
    addresses: [],
    banners: [],
    dashboardStats: null,

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
            // Set flag to prevent unauthorized error notifications
            (window as any).__isLoggingOut = true;
            await axios.post('/api/auth/logout')
            set({ user: null })
            toast.success("Logout successful")
        } catch (error: any) {
            // Don't show error toast during logout
            set({ user: null })
        } finally {
            // Clear the flag after a short delay
            setTimeout(() => {
                (window as any).__isLoggingOut = false;
            }, 500);
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
            throw error;
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


    getOrders: async (params = {}) => {
        set({ isLoading: true });
        try {
            const { page = 1, limit = 5 } = params;
            const res = await axios.get(`/api/orders?page=${page}&limit=${limit}`);
            set({
                orders: res.data.orders,
                orderPagination: {
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages,
                    totalOrders: res.data.totalOrders
                },
                isLoading: false
            });
        } catch (error: any) {
            set({ isLoading: false });
            console.error("Failed to fetch orders", error);
        }
    },

    getOrderById: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`/api/orders/${id}`);
            set({ currentOrder: res.data, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, currentOrder: null });
            console.error("Failed to fetch order details", error);
            toast.error(error.response?.data?.message || "Failed to fetch order details");
        }
    },

    adminGetOrders: async (params: { page?: number; limit?: number; search?: string } = {}) => {
        set({ isLoading: true });
        try {
            const { page = 1, limit = 10, search = "" } = params;
            const res = await axios.get(`/api/admin/orders?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`);
            set({
                adminOrders: res.data.orders,
                adminOrderPagination: {
                    currentPage: res.data.currentPage,
                    totalPages: res.data.totalPages,
                    totalOrders: res.data.totalOrders
                },
                isLoading: false
            });
        } catch (error: any) {
            set({ isLoading: false });
            console.error("Failed to fetch admin orders", error);
            toast.error(error.response?.data?.message || "Failed to fetch orders");
        }
    },

    adminUpdateOrderStatus: async (id, status) => {
        try {
            const res = await axios.put(`/api/admin/orders/${id}/status`, { orderStatus: status });
            toast.success(res.data.message);
            set((state) => ({
                adminOrders: state.adminOrders.map(order =>
                    order._id === id ? { ...order, orderStatus: status } : order
                )
            }));
        } catch (error: any) {
            console.error("Failed to update order status", error);
            toast.error(error.response?.data?.message || "Failed to update order status");
        }
    },

    getAdminStats: async () => {
        try {
            const res = await axios.get("/api/admin/orders/stats");
            set({ dashboardStats: res.data });
        } catch (error: any) {
            console.error("Failed to fetch admin stats", error);
        }
    },

    getBanners: async () => {
        try {
            const res = await axios.get("/api/banners");
            set({ banners: res.data });
        } catch (error: any) {
            console.error("Failed to fetch banners", error);
        }
    },

    adminGetBanners: async () => {
        try {
            const res = await axios.get("/api/admin/banners");
            set({ banners: res.data });
        } catch (error: any) {
            console.error("Failed to fetch admin banners", error);
        }
    },

    addBanner: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axios.post("/api/admin/banners", data);
            toast.success(res.data.message);
            set((state) => ({ banners: [res.data.banner, ...state.banners] }));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add banner");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteBanner: async (id) => {
        try {
            const res = await axios.delete(`/api/admin/banners/${id}`);
            toast.success(res.data.message);
            set((state) => ({ banners: state.banners.filter(b => b._id !== id) }));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete banner");
        }
    },

    toggleBannerStatus: async (id) => {
        try {
            const res = await axios.patch(`/api/admin/banners/${id}/toggle`);
            toast.success(res.data.message);
            set((state) => ({
                banners: state.banners.map(b => b._id === id ? res.data.banner : b)
            }));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to toggle status");
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

    updateAddress: async (id, address) => {
        try {
            const res = await axios.put(`/api/user/address/${id}`, address);
            set({ addresses: res.data });
            toast.success("Address updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update address");
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

        // Don't handle 401 errors during intentional logout
        if ((window as any).__isLoggingOut) {
            return Promise.reject(error);
        }

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
