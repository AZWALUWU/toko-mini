import React, { useState, useEffect, useRef } from "react";
import { X, Send, AlertCircle, CheckCircle } from "lucide-react";
import type { CartItem, CheckoutForm } from "../types";
import { formatRupiah } from "../lib/utils";
import { formatWhatsAppMessage, createWhatsAppCheckoutUrl } from "../lib/whatsapp";
import { STORE_NAME, STORE_PHONE_NUMBER } from "../data/products";
import { Button } from "./ui/button";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onCheckoutSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalPrice,
  onCheckoutSuccess,
}) => {
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSubmittedUrl(null);
      setErrors({});
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    initialFocusRef.current?.focus();

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim() || form.name.trim().length < 3) {
      newErrors.name = "Nama lengkap wajib diisi minimal 3 karakter.";
    }

    const cleanPhone = form.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = "Nomor WhatsApp aktif wajib diisi (minimal 10 digit angka).";
    }

    if (!form.address.trim() || form.address.trim().length < 8) {
      newErrors.address = "Alamat lengkap pengiriman wajib diisi minimal 8 karakter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = formatWhatsAppMessage(STORE_NAME, items, totalPrice, form);
    const whatsappUrl = createWhatsAppCheckoutUrl(STORE_PHONE_NUMBER, message);

    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setSubmittedUrl(whatsappUrl);
    onCheckoutSuccess();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl z-10 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center justify-between">
          <div>
            <h2 id="checkout-title" className="text-lg font-bold text-zinc-900 leading-tight">
              Informasi Pemesanan
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Isi data untuk diteruskan ke chat WhatsApp penjual
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Tutup formulir checkout"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {submittedUrl ? (
            /* Success Feedback State */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">
                Pesanan Berhasil Disiapkan
              </h3>
              <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                Rincian pesanan Anda telah dibuat. Jika jendela WhatsApp tidak terbuka otomatis, silakan klik tombol di bawah.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={submittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                  Buka Chat WhatsApp
                </a>
                <Button variant="outline" onClick={onClose} className="min-h-[44px]">
                  Tutup dan Kembali
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Order Summary Strip */}
              <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm">
                <div className="flex justify-between items-center text-zinc-700 font-medium">
                  <span>Total Belanja ({items.length} jenis barang)</span>
                  <span className="text-emerald-800 font-bold text-base">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
                >
                  Nama Lengkap Penerima <span className="text-rose-600">*</span>
                </label>
                <input
                  ref={initialFocusRef}
                  id="checkout-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                    errors.name ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Nomor WhatsApp */}
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
                >
                  Nomor WhatsApp Aktif <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                    errors.phone ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
                  }`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Alamat Pengiriman */}
              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
                >
                  Alamat Lengkap Pengiriman <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                  className={`w-full min-h-[80px] px-3.5 py-2 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 resize-none ${
                    errors.address ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
                  }`}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? "address-error" : undefined}
                />
                {errors.address && (
                  <p id="address-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label
                  htmlFor="checkout-notes"
                  className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
                >
                  Catatan Pesanan (Opsional)
                </label>
                <input
                  id="checkout-notes"
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Misal: titip di pos satpam atau jangan dibunyikan bel"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
                  aria-label="Kirim pesanan ini langsung ke WhatsApp penjual"
                >
                  <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                  Kirim Pesanan ke WhatsApp
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
