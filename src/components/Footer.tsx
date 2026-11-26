import React from "react";
import { STORE_NAME, STORE_PHONE_NUMBER } from "../data/products";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-white border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-sm text-zinc-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Info Toko */}
          <div>
            <h3 className="font-semibold text-zinc-900 mb-2">
              {STORE_NAME}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Menyediakan sembako dan kebutuhan pokok rumah tangga berkualitas dengan harga terjangkau.
            </p>
          </div>

          {/* Jam Operasional & Kontak */}
          <div>
            <h3 className="font-semibold text-zinc-900 mb-2">
              Jam Operasional & Kontak
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Buka setiap hari: 08:00 sampai 21:00 WIB
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              WhatsApp Layanan: +{STORE_PHONE_NUMBER}
            </p>
          </div>

          {/* Ketentuan Pesanan */}
          <div>
            <h3 className="font-semibold text-zinc-900 mb-2">
              Metode Transaksi
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Pesanan diproses langsung oleh penjual via WhatsApp. Pembayaran dapat dilakukan via transfer bank atau bayar di tempat (COD) sesuai kesepakatan chat.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
          <span>&copy; {new Date().getFullYear()} {STORE_NAME}. Hak cipta dilindungi.</span>
          <span>Dibuat untuk kemudahan belanja warga sekitar.</span>
        </div>
      </div>
    </footer>
  );
};
