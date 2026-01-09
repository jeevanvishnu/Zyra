import {create} from "zustand"
import toast from "react-hot-toast"
import  axios from '../lib/axios'

 interface AuthStore {
  user: any,
  isLoading: boolean;
  signup: (data: SignupPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
}

export const userAuthStore = create<AuthStore>((set)=>({
    user:null,
    isLoading:false,

    signup:async ({name, email, password, confirmPassword}) =>{
        set({isLoading:true})

        if(password !== confirmPassword){
            set({isLoading:false})
            toast.error("password doesn't match")
        }
        try {
            const res = await axios.post('/api/auth/signup',{name, email, password})
            set({user:res.data})
        } catch (error) {
             set({isLoading:false})
             toast.error(error?.response?.data?.message || 'An error occurred')
        }
    },

    login: async ({email , password}) =>{
        set({isLoading:true})

        try {
            const res = await axios.post('/api/auth/login',{email, password})
            set({user:res?.data})
        } catch (error) {
            set({isLoading:false})
             toast.error(error?.response?.data?.message || 'An error occurred')
        }
    }
}))