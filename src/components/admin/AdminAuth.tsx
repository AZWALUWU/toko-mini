import React, { useState, useEffect, useRef } from "react";
import { Lock, KeyRound, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const ADMIN_PASSWORD = "rfEoDAz$hY@N7v&2llE2";

interface AdminAuthProps {
  onSuccess: (password: string) => void;
  onBackToStore: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  onSuccess,
  onBackToStore,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password tidak boleh kosong.");
      return;
    }

    if (password.trim() !== ADMIN_PASSWORD) {
      setError("Password admin salah. Akses ditolak.");
      return;
    }

    onSuccess(password.trim());
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sm:p-8">
      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-zinc-900 mb-1">
          Masuk Panel Pengelola
        </h1>
        <p className="text-xs text-zinc-500">
          Masukkan 20 karakter password otentikasi admin untuk mengelola katalog produk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="admin-password-input"
            className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5"
          >
            Password Admin
          </label>
          <input
            ref={inputRef}
            id="admin-password-input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Masukkan 20 karakter password"
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
              error ? "border-rose-500 bg-rose-50/30" : "border-zinc-300 bg-white"
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? "password-error" : undefined}
          />
          {error && (
            <p id="password-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBackToStore}
            className="w-full sm:w-1/2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Kembali ke Toko
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-1/2 min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
          >
            <KeyRound className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Masuk Panel
          </Button>
        </div>
      </form>
    </div>
  );
};
