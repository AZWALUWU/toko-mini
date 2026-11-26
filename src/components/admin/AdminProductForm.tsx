import React, { useState, useEffect, useRef } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import type { Product, ProductCategory } from "../../types";
import { Button } from "../ui/button";

const CATEGORIES: Exclude<ProductCategory, "Semua">[] = [
  "Bahan Pokok",
  "Minuman",
  "Bumbu Dapur",
  "Kebersihan",
];

interface AdminProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id">, id?: string) => void;
  initialProduct?: Product | null;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialProduct,
}) => {
  const isEditing = !!initialProduct;
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Bahan Pokok" as Exclude<ProductCategory, "Semua">,
    price: "",
    unit: "",
    stock: "",
    image: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        category: initialProduct.category,
        price: String(initialProduct.price),
        unit: initialProduct.unit,
        stock: String(initialProduct.stock),
        image: initialProduct.image,
        description: initialProduct.description,
      });
    } else {
      setFormData({
        name: "",
        category: "Bahan Pokok",
        price: "",
        unit: "satuan",
        stock: "10",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
        description: "",
      });
    }

    setErrors({});
    initialFocusRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, initialProduct, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = "Nama produk wajib diisi minimal 3 karakter.";
    }

    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Harga produk harus berupa angka lebih dari 0.";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Satuan barang wajib diisi (misal: kg, pouch 2L).";
    }

    const stockNum = Number(formData.stock);
    if (formData.stock === "" || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = "Jumlah stok harus berupa angka (minimal 0).";
    }

    if (!formData.image.trim() || !formData.image.startsWith("http")) {
      newErrors.image = "URL foto wajib diawali dengan http:// atau https://.";
    }

    if (!formData.description.trim() || formData.description.trim().length < 5) {
      newErrors.description = "Deskripsi produk wajib diisi minimal 5 karakter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(
      {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price),
        unit: formData.unit.trim(),
        stock: Number(formData.stock),
        image: formData.image.trim(),
        description: formData.description.trim(),
      },
      initialProduct?.id
    );

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center justify-between">
          <h2 id="product-form-title" className="text-lg font-bold text-zinc-900 leading-tight">
            {isEditing ? "Ubah Data Produk" : "Tambah Produk Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Tutup formulir produk"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4" noValidate>
          {/* Nama Produk */}
          <div>
            <label
              htmlFor="product-name"
              className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
            >
              Nama Produk <span className="text-rose-600">*</span>
            </label>
            <input
              ref={initialFocusRef}
              id="product-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Beras Ramos Wangi 5 Kg"
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                errors.name ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-err" : undefined}
            />
            {errors.name && (
              <p id="name-err" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Kategori & Satuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-category"
                className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
              >
                Kategori <span className="text-rose-600">*</span>
              </label>
              <select
                id="product-category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Exclude<ProductCategory, "Semua">,
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-unit"
                className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
              >
                Satuan Kemasan <span className="text-rose-600">*</span>
              </label>
              <input
                id="product-unit"
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Contoh: karung 5kg, pouch 2L"
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  errors.unit ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
                }`}
                aria-invalid={!!errors.unit}
              />
              {errors.unit && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {errors.unit}
                </p>
              )}
            </div>
          </div>

          {/* Harga & Stok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-price"
                className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
              >
                Harga (Rupiah) <span className="text-rose-600">*</span>
              </label>
              <input
                id="product-price"
                type="number"
                min="100"
                step="500"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="75000"
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  errors.price ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
                }`}
                aria-invalid={!!errors.price}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="product-stock"
                className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
              >
                Jumlah Stok <span className="text-rose-600">*</span>
              </label>
              <input
                id="product-stock"
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="20"
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  errors.stock ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
                }`}
                aria-invalid={!!errors.stock}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* URL Gambar */}
          <div>
            <label
              htmlFor="product-image"
              className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
            >
              URL Foto Produk <span className="text-rose-600">*</span>
            </label>
            <input
              id="product-image"
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                errors.image ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
              }`}
              aria-invalid={!!errors.image}
            />
            {errors.image && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.image}
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label
              htmlFor="product-desc"
              className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
            >
              Deskripsi Produk <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="product-desc"
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Karakteristik produk, mutu, dan keterangan penting bagi pembeli"
              className={`w-full min-h-[80px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 resize-none ${
                errors.description ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
              }`}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-1/2 min-h-[44px]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="w-1/2 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              <Save className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Simpan Produk
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
