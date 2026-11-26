import { useState, useEffect } from "react";
import type { Product } from "../types";
import { PRODUCTS as INITIAL_PRODUCTS } from "../data/products";

const STORAGE_KEY = "toko_mini_products_v1";

function loadLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadLocalProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "local" | "error">("local");

  // Sinkronisasi data dari Cloudflare D1 jika endpoint tersedia
  useEffect(() => {
    let isMounted = true;
    const fetchRemote = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && isMounted) {
          setProducts(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          setSyncStatus("synced");
        }
      } catch {
        // Fallback ke penyimpanan lokal browser
        if (isMounted) setSyncStatus("local");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRemote();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveLocal = (items: Product[]) => {
    setProducts(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // LocalStorage fallback
    }
  };

  const addProduct = async (
    data: Omit<Product, "id">,
    pin: string
  ): Promise<{ success: boolean; error?: string }> => {
    const newProduct: Product = {
      ...data,
      id: `p-${Date.now()}`,
    };

    const nextProducts = [newProduct, ...products];
    saveLocal(nextProducts);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        // Tetap simpan di local, hanya tandai jika PIN salah
        if (res.status === 401) {
          return { success: false, error: errData.error || "PIN Admin salah" };
        }
      }
    } catch {
      // Offline/Local dev mode
    }

    return { success: true };
  };

  const updateProduct = async (
    product: Product,
    pin: string
  ): Promise<{ success: boolean; error?: string }> => {
    const nextProducts = products.map((p) =>
      p.id === product.id ? product : p
    );
    saveLocal(nextProducts);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          return { success: false, error: errData.error || "PIN Admin salah" };
        }
      }
    } catch {
      // Offline/Local dev mode
    }

    return { success: true };
  };

  const deleteProduct = async (
    productId: string,
    pin: string
  ): Promise<{ success: boolean; error?: string }> => {
    const nextProducts = products.filter((p) => p.id !== productId);
    saveLocal(nextProducts);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "x-admin-pin": pin,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          return { success: false, error: errData.error || "PIN Admin salah" };
        }
      }
    } catch {
      // Offline/Local dev mode
    }

    return { success: true };
  };

  const resetToDefaults = () => {
    saveLocal(INITIAL_PRODUCTS);
  };

  return {
    products,
    isLoading,
    syncStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
  };
}
