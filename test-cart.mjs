import assert from "node:assert";

// 1. Format Rupiah check
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const formatted = formatRupiah(50000);
assert.match(formatted, /50\.000/, "formatRupiah harus memformat ribuan dengan benar");

// 2. WhatsApp checkout URL check
function createWhatsAppCheckoutUrl(storePhone, message) {
  const cleanPhone = storePhone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

const url = createWhatsAppCheckoutUrl("+62 812-3456-7890", "Halo Toko, mau beli");
assert.strictEqual(
  url,
  "https://wa.me/6281234567890?text=Halo%20Toko%2C%20mau%20beli",
  "URL WhatsApp harus membersihkan nomor telepon dan meng-encode pesan dengan benar"
);

// 3. Cart calculation logic check
const mockCart = [
  { price: 74000, quantity: 2 },
  { price: 35000, quantity: 1 },
];
const totalPrice = mockCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
assert.strictEqual(totalPrice, 183000, "Perhitungan total harga keranjang harus tepat");

console.log("Self-check logic passed successfully.");
