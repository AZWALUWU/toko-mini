import React from "react";
import { Search, X } from "lucide-react";
import type { ProductCategory } from "../types";

const CATEGORIES: ProductCategory[] = [
  "Semua",
  "Bahan Pokok",
  "Minuman",
  "Bumbu Dapur",
  "Kebersihan",
];

interface ProductFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  totalResults: number;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalResults,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-xl">
        <label htmlFor="search-product" className="sr-only">
          Cari produk toko
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          id="search-product"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari beras, minyak, kopi..."
          className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:border-transparent transition-shadow"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Hapus teks pencarian"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Categories Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div
          role="tablist"
          aria-label="Kategori Produk"
          className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <span className="text-xs text-zinc-500 font-medium">
          Menampilkan {totalResults} produk
        </span>
      </div>
    </div>
  );
};
