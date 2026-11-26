import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "../types";
import { formatRupiah } from "../lib/utils";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const [added, setAdded] = useState(false);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <article className="flex flex-col bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm hover:border-zinc-300 transition-colors">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-block px-2.5 py-1 text-xs font-medium rounded bg-zinc-900/80 text-white backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-zinc-900 text-base leading-snug line-clamp-2">
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <div>
              <span className="text-lg font-bold text-emerald-800">
                {formatRupiah(product.price)}
              </span>
              <span className="text-xs text-zinc-500 ml-1">
                / {product.unit}
              </span>
            </div>
            <span
              className={`text-xs font-medium ${
                isOutOfStock ? "text-rose-600" : "text-zinc-500"
              }`}
            >
              {isOutOfStock ? "Stok habis" : `Stok: ${product.stock}`}
            </span>
          </div>

          <Button
            type="button"
            variant={added ? "secondary" : "primary"}
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="w-full min-h-[44px]"
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Ditambahkan
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
                Tambah ke Keranjang
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};
