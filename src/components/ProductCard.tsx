import React from "react";
import type { Product } from "../types";
import { formatRupiah } from "../lib/utils";
import { Plus, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetail,
}) => {
  const isOutOfStock = product.stock === 0;

  return (
    <article
      onClick={() => onViewDetail && onViewDetail(product)}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer focus-within:ring-2 focus-within:ring-emerald-700"
    >
      <div>
        {/* Gambar Produk */}
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-zinc-800 shadow-sm">
            {product.category}
          </span>
          <span
            className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
              isOutOfStock
                ? "bg-rose-100 text-rose-800"
                : product.stock <= 5
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {isOutOfStock ? "Habis" : `Sisa ${product.stock}`}
          </span>

          {/* Quick view indicator on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-zinc-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-800" aria-hidden="true" />
              Lihat Detail
            </span>
          </div>
        </div>

        {/* Informasi Produk */}
        <div className="p-4">
          <h2 className="font-semibold text-zinc-900 text-sm sm:text-base leading-snug line-clamp-2 mb-1 group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h2>
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Harga & Tombol Tambah */}
      <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-zinc-100 mt-2">
        <div>
          <span className="block text-xs text-zinc-400 font-medium">
            per {product.unit}
          </span>
          <span className="text-base sm:text-lg font-bold text-zinc-900">
            {formatRupiah(product.price)}
          </span>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="inline-flex items-center justify-center gap-1 min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-medium text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          aria-label={`Tambah ${product.name} ke keranjang`}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span className="hidden xs:inline">Beli</span>
        </button>
      </div>
    </article>
  );
};
