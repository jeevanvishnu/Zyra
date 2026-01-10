import {create} from "zustand"
import toast from "react-hot-toast"
import  axios from '../lib/axios'


 interface AuthStore {
  user: any,
  isLoading: boolean;
  checkingAuth:boolean,
  checkAuth:(data:string)=>Promise<void>
  signup: (data: SignupPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
}

export const userAuthStore = create<AuthStore>((set)=>({
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
    }
}))