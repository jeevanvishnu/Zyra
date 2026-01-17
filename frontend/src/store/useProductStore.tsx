import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { AxiosError } from "axios";

interface Product {
  productName: string;
  image: string;
  price: number;
  stock: number;
  description: string;
  category: string;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  getAllProducts: () => Promise<void>;
  addProduct: ()=> Promise<void>
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,

  getAllProducts: async () => {
    try {
      set({ loading: true });

      const res = await axios.get("/api/product");

      set({
        products: res.data,
        loading: false,
      });
    } catch (error) {
      const err = error as AxiosError<any>;

      set({ loading: false });
      toast.error(err.response?.data?.message || "Failed to fetch products");
    }
  },

  addProduct:async () =>{
    set({loading:false})
    try {
        const res = await axios.post('/api/product')
        set({products:res.data , loading:true})
    } catch (error) {
       set({loading:false}) 
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }

  }

}));
