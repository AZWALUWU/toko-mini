import React, { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingBag, Send, Check } from "lucide-react";
import type { Product } from "../types";
import { formatRupiah } from "../lib/utils";
import { Button } from "./ui/button";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsAddedFeedback(false);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose, product]);

  if (!isOpen || !product) return null;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
      onClose();
    }, 600);
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, quantity);
    onClose();
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-11 h-11 inline-flex items-center justify-center rounded-full bg-white/90 text-zinc-600 hover:text-zinc-900 hover:bg-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          aria-label="Tutup jendela detail produk"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gambar Produk */}
            <div className="relative aspect-square bg-zinc-100 border-b md:border-b-0 md:border-r border-zinc-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-zinc-800 shadow-sm">
                {product.category}
              </span>
            </div>

            {/* Konten & Aksi */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                      isOutOfStock
                        ? "bg-rose-100 text-rose-700"
                        : product.stock <= 5
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isOutOfStock ? "Stok Habis" : `Tersedia: ${product.stock} ${product.unit}`}
                  </span>
                </div>

                <h2
                  id="product-detail-title"
                  className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight leading-snug mb-2"
                >
                  {product.name}
                </h2>

                <div className="mb-4">
                  <span className="text-2xl font-extrabold text-emerald-800">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-xs text-zinc-500 ml-1.5 font-medium">
                    / {product.unit}
                  </span>
                </div>

                <div className="border-t border-zinc-100 pt-3 mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Deskripsi Produk
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Kontrol Kuantitas & Beli */}
              <div className="border-t border-zinc-200 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    Jumlah Pesanan
                  </span>
                  <div className="flex items-center border border-zinc-300 rounded-lg bg-zinc-50">
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={handleDecrement}
                      className="w-11 h-11 inline-flex items-center justify-center text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:pointer-events-none"
                      aria-label="Kurangi jumlah"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity >= product.stock}
                      onClick={handleIncrement}
                      className="w-11 h-11 inline-flex items-center justify-center text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:pointer-events-none"
                      aria-label="Tambah jumlah"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Total Bayar Preview */}
                <div className="flex items-center justify-between text-sm py-1">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-bold text-zinc-900">
                    {formatRupiah(product.price * quantity)}
                  </span>
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isOutOfStock}
                    onClick={handleAddToCartClick}
                    className="w-full sm:w-1/2 min-h-[48px] text-zinc-800 border-zinc-300 hover:bg-zinc-100"
                  >
                    {isAddedFeedback ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-emerald-600" aria-hidden="true" />
                        Ditambahkan!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 mr-2 text-emerald-800" aria-hidden="true" />
                        + Keranjang
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleBuyNowClick}
                    className="w-full sm:w-1/2 min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                    Beli Sekarang
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
