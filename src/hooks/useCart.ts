import { useState, useEffect, useMemo } from "react";
import type { CartItem, Product } from "../types";

const STORAGE_KEY = "toko_mini_cart_v1";

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // LocalStorage error fallback
    }
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + 1, product.stock);
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: nextQty } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.product.id !== productId);
      }
      return prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(Math.max(1, quantity), item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      });
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((acc, curr) => acc + curr.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0),
    [items]
  );

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  };
}
