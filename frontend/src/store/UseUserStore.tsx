import { create } from "zustand"
import toast from "react-hot-toast"
import axios from '../lib/axios'


interface AuthStore {
    user: any,
    isLoading: boolean;
    checkingAuth: boolean,
    checkAuth: () => Promise<void>
    signup: (data: SignupPayload) => Promise<void>;
    login: (data: LoginPayload) => Promise<void>;
    logout: (data: LogoutPlayoad) => Promise<void>
    refershToken: (data: string) => Promise<void>
}

export const userAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isLoading: false,
    checkingAuth: false,

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
        } catch (error) {
            set({ isLoading: false })
            toast.error(error?.response?.data?.message || 'An error occurred')
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
        } catch (error) {
            set({ isLoading: false })
            toast.error(error?.response?.data?.message || 'An error occurred')
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true })

        try {
            const res = await axios.get('/api/auth/profile')
            set({ user: res.data, checkingAuth: false })
        } catch (err) {
            set({ checkingAuth: true, user: null })
            toast.error(err?.response?.data?.message || 'An error occurred')
        }
    },
    logout: async () => {
        console.log("inside")
        try {
            await axios.post('/api/auth/logout')
            set({ user: null })
            toast.success("Logout sucessfull")
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error occurred")
        }
    },
    refershToken: async () => {
        try {
            if (get().checkingAuth) return
            set({ checkingAuth: true })


            const res = await axios.post('/api/auth/refresh-token')
            set({accessToken: res.data.accessToken, checkingAuth: false })
            return res.data
        } catch (error) {
            set({ checkingAuth: false })
            toast.error(error?.response?.data?.message || 'An error occurred')
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
                    refreshPromise = userAuthStore.getState().refershToken();
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
