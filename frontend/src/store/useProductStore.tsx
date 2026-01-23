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
  totalPages: number;
  currentPage: number;
  getAllProducts: (page?: number, limit?: number) => Promise<void>;
  addProduct: (formData: FormData) => Promise<void>;
  editProduct: (id: string, formData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  totalPages: 1,
  currentPage: 1,

  getAllProducts: async (page = 1, limit = 4) => {
    try {
      set({ loading: true });

      const res = await axios.get(`/api/products?page=${page}&limit=${limit}`);

      set({
        products: res.data.products,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage,
        loading: false,
      });
    } catch (error) {
      const err = error as AxiosError<any>;

      set({ loading: false });
      toast.error(err.response?.data?.message || "Failed to fetch products");
    }
  },

  addProduct: async (formData: FormData) => {
    set({ loading: true });
    try {
      await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { currentPage } = get();
      await get().getAllProducts(currentPage);

      toast.success("Product added successfully!");
    } catch (error) {
      const err = error as AxiosError<any>;
      set({ loading: false });
      toast.error(err.response?.data?.message || "Failed to add product");
      throw error;
    }
  },

  editProduct: async (id: string, formData: FormData) => {
    set({ loading: true });
    try {
      await axios.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { currentPage } = get();
      await get().getAllProducts(currentPage);

      toast.success("Product updated successfully!");
    } catch (error) {
      const err = error as AxiosError<any>;
      set({ loading: false });
      toast.error(err.response?.data?.message || "Failed to update product");
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true });
    try {
      console.log(id,"id,,")
      await axios.delete(`/api/products/${id}`);
      const { currentPage } = get();
      await get().getAllProducts(currentPage);

      toast.success("Product deleted successfully");
    } catch (error: any) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "Failed to delete product");
    }
  }

}));
