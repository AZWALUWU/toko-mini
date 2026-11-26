import React, { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  RotateCcw,
  Search,
  Database,
  HardDrive,
  Package,
} from "lucide-react";
import type { Product } from "../../types";
import { formatRupiah } from "../../lib/utils";
import { Button } from "../ui/button";
import { AdminProductForm } from "./AdminProductForm";
import { AdminDeleteModal } from "./AdminDeleteModal";

interface AdminDashboardProps {
  products: Product[];
  syncStatus: "synced" | "local" | "error";
  onAddProduct: (data: Omit<Product, "id">) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetDefaults: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  syncStatus,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetDefaults,
  onExitAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Product, "id">, id?: string) => {
    if (id) {
      onUpdateProduct({ ...data, id });
    } else {
      onAddProduct(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      onDeleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-4 sm:p-6 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Panel Pengelola Inventori
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                syncStatus === "synced"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {syncStatus === "synced" ? (
                <>
                  <Database className="w-3 h-3" aria-hidden="true" />
                  Cloudflare D1 Aktif
                </>
              ) : (
                <>
                  <HardDrive className="w-3 h-3" aria-hidden="true" />
                  Penyimpanan Lokal Aktif
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            Total {products.length} produk terdaftar dalam katalog etalase toko
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={onExitAdmin}
            className="min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Kembali ke Toko
          </Button>

          <Button
            type="button"
            onClick={handleOpenAdd}
            className="min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Tambah Produk
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (window.confirm("Kembalikan daftar produk ke 10 produk bawaan?")) {
                onResetDefaults();
              }
            }}
            className="min-h-[44px] text-zinc-500 hover:text-zinc-800"
            title="Reset ke produk awal"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Reset Bawaan
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <label htmlFor="admin-search" className="sr-only">
          Cari barang inventori
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>
        <input
          id="admin-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama barang atau kategori..."
          className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        />
      </div>

      {/* Inventory List Table / Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white border border-zinc-200 rounded-xl">
          <Package className="w-10 h-10 text-zinc-400 mx-auto mb-2" aria-hidden="true" />
          <h2 className="text-base font-semibold text-zinc-900">
            Tidak ada produk ditemukan
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Gunakan kata kunci pencarian lain atau klik Tambah Produk untuk membuat barang baru.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-700">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold uppercase text-zinc-500 tracking-wider">
                <tr>
                  <th scope="col" className="p-4">Foto & Nama</th>
                  <th scope="col" className="p-4">Kategori</th>
                  <th scope="col" className="p-4">Harga / Satuan</th>
                  <th scope="col" className="p-4">Stok</th>
                  <th scope="col" className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Foto & Nama */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-semibold text-zinc-900 block truncate">
                            {item.name}
                          </span>
                          <span className="text-xs text-zinc-400 block truncate">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium rounded bg-zinc-100 text-zinc-800">
                        {item.category}
                      </span>
                    </td>

                    {/* Harga & Satuan */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-semibold text-zinc-900 block">
                        {formatRupiah(item.price)}
                      </span>
                      <span className="text-xs text-zinc-400 block">
                        per {item.unit}
                      </span>
                    </td>

                    {/* Stok */}
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${
                          item.stock === 0
                            ? "bg-rose-100 text-rose-700"
                            : item.stock <= 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {item.stock === 0 ? "Habis" : `${item.stock} unit`}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-zinc-600 hover:text-emerald-800 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                          aria-label={`Ubah data ${item.name}`}
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingProduct(item)}
                          className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form Tambah / Edit */}
      <AdminProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialProduct={editingProduct}
      />

      {/* Modal Konfirmasi Hapus */}
      <AdminDeleteModal
        isOpen={!!deletingProduct}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
