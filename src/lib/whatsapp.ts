import type { CartItem, CheckoutForm } from "../types";
import { formatRupiah } from "./utils";

export function formatWhatsAppMessage(
  storeName: string,
  items: CartItem[],
  total: number,
  form: CheckoutForm
): string {
  const itemList = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (${item.quantity} ${item.product.unit}) = ${formatRupiah(
          item.product.price * item.quantity
        )}`
    )
    .join("\n");

  const lines = [
    `Halo ${storeName}, saya ingin memesan barang berikut:`,
    "",
    "Daftar Pesanan:",
    itemList,
    "",
    `Total Belanja: ${formatRupiah(total)}`,
    "",
    "Data Pengiriman:",
    `Nama: ${form.name.trim()}`,
    `Nomor WhatsApp: ${form.phone.trim()}`,
    `Alamat Lengkap: ${form.address.trim()}`,
  ];

  if (form.notes && form.notes.trim().length > 0) {
    lines.push(`Catatan: ${form.notes.trim()}`);
  }

  lines.push("", "Mohon konfirmasi ketersediaan barang dan rincian ongkir. Terima kasih.");

  return lines.join("\n");
}

export function createWhatsAppCheckoutUrl(
  storePhone: string,
  message: string
): string {
  const cleanPhone = storePhone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
