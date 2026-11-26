import React, { useEffect, useRef } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import type { CartItem } from "../types";
import { formatRupiah } from "../lib/utils";
import { Button } from "./ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  totalItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key press (R-32)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus close button on mount
    closeButtonRef.current?.focus();

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 leading-tight">
                Keranjang Belanja
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {totalItems} barang dipilih
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              aria-label="Tutup keranjang belanja"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              /* Empty State (R-27) */
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900">
                  Keranjang masih kosong
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-6">
                  Silakan pilih barang yang Anda butuhkan dari etalase untuk melanjutkan pembelian.
                </p>
                <Button variant="outline" onClick={onClose} className="min-h-[44px]">
                  Mulai Belanja
                </Button>
              </div>
            ) : (
              /* Item List */
              <div className="divide-y divide-zinc-200">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="py-4 flex gap-4 items-start">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-zinc-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {formatRupiah(product.price)} / {product.unit}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        {/* Qty Controls */}
                        <div className="inline-flex items-center border border-zinc-300 rounded-lg bg-zinc-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, quantity - 1)}
                            className="w-11 h-11 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-l-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                            aria-label={`Kurangi jumlah ${product.name}`}
                          >
                            <Minus className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <span
                            className="w-8 text-center text-sm font-semibold text-zinc-900"
                            aria-live="polite"
                          >
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="w-11 h-11 flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                            aria-label={`Tambah jumlah ${product.name}`}
                          >
                            <Plus className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>

                        {/* Subtotal & Delete */}
                        <div className="text-right">
                          <span className="block text-sm font-semibold text-zinc-900">
                            {formatRupiah(product.price * quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id)}
                            className="mt-1 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-zinc-400 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                            aria-label={`Hapus ${product.name} dari keranjang`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-zinc-200 bg-zinc-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Total Harga Barang</span>
                <span className="font-bold text-lg text-emerald-800">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Belum termasuk ongkos kirim. Ongkir ditentukan via WhatsApp penjual.
              </p>

              <div className="space-y-2 pt-2">
                <Button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full min-h-[44px]"
                  aria-label="Lanjutkan ke pengisian data pesanan"
                >
                  Lanjut ke Checkout
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClearCart}
                  className="w-full min-h-[44px] text-zinc-500 hover:text-rose-600"
                  aria-label="Kosongkan seluruh isi keranjang"
                >
                  Kosongkan Keranjang
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
