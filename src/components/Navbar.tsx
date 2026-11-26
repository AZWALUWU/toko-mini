import React from "react";
import { ShoppingBag, Store, ArrowLeft } from "lucide-react";
import { STORE_NAME } from "../data/products";

interface NavbarProps {
  totalItems: number;
  onOpenCart: () => void;
  isAdminRoute: boolean;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalItems,
  onOpenCart,
  isAdminRoute,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg p-1 -ml-1"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="font-bold text-zinc-900 tracking-tight text-base sm:text-lg block leading-tight">
              {STORE_NAME}
            </span>
            <span className="text-xs text-zinc-500 block">
              {isAdminRoute ? "Panel Khusus Pengelola" : "Pesan langsung ke WhatsApp"}
            </span>
          </div>
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {isAdminRoute ? (
            <button
              type="button"
              onClick={onNavigateHome}
              className="min-h-[44px] px-3.5 py-2 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Halaman Utama</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-900 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              aria-label={`Buka keranjang belanja, ada ${totalItems} barang`}
            >
              <ShoppingBag className="w-5 h-5 text-emerald-800" aria-hidden="true" />
              <span className="hidden sm:inline">Keranjang</span>
              <span
                className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full bg-emerald-700 text-white"
                aria-live="polite"
              >
                {totalItems}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
