import React, { useState, useEffect, useRef } from "react";
import { X, Lock, KeyRound, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError("");
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    inputRef.current?.focus();

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("PIN tidak boleh kosong.");
      return;
    }

    // Default PIN: 123456
    if (pin.trim() !== "123456") {
      setError("PIN salah. Gunakan PIN bawaan: 123456");
      return;
    }

    onSuccess(pin.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-base">
            <Lock className="w-5 h-5 text-emerald-800" aria-hidden="true" />
            <h2 id="pin-modal-title">Akses Pengelola Toko</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label="Tutup dialog PIN"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
          Masukkan 6 digit PIN untuk mengelola daftar produk dan stok barang toko.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-pin-input"
              className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
            >
              PIN Pengelola
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="admin-pin-input"
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                placeholder="123456"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm tracking-widest text-center text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                aria-invalid={!!error}
                aria-describedby={error ? "pin-error" : "pin-hint"}
              />
            </div>

            {error ? (
              <p id="pin-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {error}
              </p>
            ) : (
              <p id="pin-hint" className="mt-1.5 text-xs text-zinc-400">
                PIN bawaan sistem: <span className="font-mono font-bold text-zinc-600">123456</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex gap-2">
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
              <KeyRound className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Buka Panel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
