import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { AxiosError } from "axios";

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

interface ProductStore {
  products: Product[];
  loading: boolean;
  getAllProducts: () => Promise<void>;
  addProduct: (formData: FormData) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,

  getAllProducts: async () => {
    console.log("Hello")
    try {
      set({ loading: true });

      const res = await axios.get("/api/products");

      set({
        products: res.data,
        loading: false,
      });
      console.log(res.data, "..........")
    } catch (error) {
      const err = error as AxiosError<any>;

      set({ loading: false });
      toast.error(err.response?.data?.message || "Failed to fetch products");
    }
  },

  addProduct: async (formData: FormData) => {
    set({ loading: true });
    try {
      const res = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Add the new product to the existing products array
      set({
        products: [...get().products, res.data.product],
        loading: false
      });

      toast.success("Product added successfully!");
    } catch (error) {
      const err = error as AxiosError<any>;
      set({ loading: false });
      toast.error(err.response?.data?.message || "Failed to add product");
      throw error;
    }
  },

}));
