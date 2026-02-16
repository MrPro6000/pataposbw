import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  stock_status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(
          (data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            category: p.category,
            stock: p.stock,
            stock_status: p.stock_status,
            image_url: p.image_url,
            created_at: p.created_at,
            updated_at: p.updated_at,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: {
    name: string;
    price: number;
    category: string;
    stock?: number;
  }) => {
    if (!user) return { error: "Not authenticated" };

    const stockNum = product.stock ?? 0;
    const stockStatus = stockNum === 0 ? "out_of_stock" : stockNum <= 5 ? "low_stock" : "in_stock";

    try {
      const { data, error } = await supabase
        .from("products")
        .insert({
          user_id: user.id,
          name: product.name,
          price: product.price,
          category: product.category,
          stock: stockNum,
          stock_status: stockStatus,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding product:", error);
        return { error: error.message };
      }

      setProducts((prev) => [
        {
          id: data.id,
          name: data.name,
          price: Number(data.price),
          category: data.category,
          stock: data.stock,
          stock_status: data.stock_status,
          image_url: data.image_url,
          created_at: data.created_at,
          updated_at: data.updated_at,
        },
        ...prev,
      ]);

      return { error: null, data };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, "id" | "created_at" | "updated_at">>) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) return { error: error.message };

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return { error: "Not authenticated" };

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) return { error: error.message };

      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
