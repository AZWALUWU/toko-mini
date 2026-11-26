import React, { useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { Product } from "../../types";
import { formatRupiah } from "../../lib/utils";
import { Button } from "../ui/button";

interface AdminDeleteModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>

        <h2 id="delete-dialog-title" className="text-base font-bold text-zinc-900 mb-1">
          Hapus Produk Ini?
        </h2>

        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          Produk <strong className="text-zinc-800">{product.name}</strong> ({formatRupiah(product.price)}) akan dihapus dari etalase toko. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-1/2 min-h-[44px]"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            className="w-1/2 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
};
