import {create} from "zustand"
import toast from "react-hot-toast"
import  axios from '../lib/axios'


 interface AuthStore {
  user: any,
  isLoading: boolean;
  checkingAuth:boolean,
  checkAuth:()=>Promise<void>
  signup: (data: SignupPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout:(data:string)=>Promisse<void>
  refershToken:(data:string)=>Promise<void>
}

export const userAuthStore = create<AuthStore>((set , get)=>({
    user:null,
    isLoading:false,
    checkingAuth:false,

    signup:async ({name, email, password, confirmPassword}) =>{
        set({isLoading:true})

        if(password !== confirmPassword){
            set({isLoading:false})
            toast.error("password doesn't match")
        }
        try {
            const res = await axios.post('/api/auth/signup',{name, email, password})
            set({user:res.data})
            toast.success("Signup sucessfull")
        } catch (error) {
             set({isLoading:false})
             toast.error(error?.response?.data?.message || 'An error occurred')
        }
    },

    login: async ({email , password}) =>{
        set({isLoading:true})

        try {
            const res = await axios.post('/api/auth/login',{email, password})
            console.log(res.data,"zus")
            set({user:res?.data})
            toast.success("Login sucessfull")
        } catch (error) {
            set({isLoading:false})
             toast.error(error?.response?.data?.message || 'An error occurred')
        }
    },

    checkAuth: async () =>{
        set({checkingAuth:true})

        try{
            const res = await axios.get('/api/auth/profile')
            set({user:res.data , checkingAuth:false })
        }catch(err){
            set({checkingAuth:true , user:null})
            toast.error(err?.response?.data?.message || 'An error occurred')
        }
    },
    logout:async () =>{
        try {
            const res = await axios.get('/api/auth/logout')
            set({user:null})
            toast.success("Logout sucessfull")
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error occurred")
        }
    },
    refershToken: async () =>{
        try {
            if(get().checkingAuth) return 
            set({checkingAuth:true})


            const res = await axios.get('/api/auth/refresh-token')
            set({checkingAuth:false})
        } catch (error) {
            set({checkingAuth:false})
            toast.error(error?.response?.data?.message || 'An error occurred')
        }
    },

}))


// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = userAuthStore.getState().refershToken()
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				userAuthStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
