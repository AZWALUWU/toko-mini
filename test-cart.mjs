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

// 4. Admin CRUD Product array operations check
let products = [
  { id: "p-01", name: "Beras 5kg", price: 74000, stock: 10 },
  { id: "p-02", name: "Minyak 2L", price: 35000, stock: 5 },
];

// Create
const newProd = { id: "p-03", name: "Gula 1kg", price: 17500, stock: 20 };
products = [newProd, ...products];
assert.strictEqual(products.length, 3, "Produk baru harus bertambah ke array");
assert.strictEqual(products[0].id, "p-03");

// Update
products = products.map((p) => (p.id === "p-02" ? { ...p, stock: 15, price: 36000 } : p));
const updated = products.find((p) => p.id === "p-02");
assert.strictEqual(updated.stock, 15, "Stok produk terupdate harus bernilai 15");
assert.strictEqual(updated.price, 36000, "Harga produk terupdate harus bernilai 36000");

// Delete
products = products.filter((p) => p.id !== "p-01");
assert.strictEqual(products.length, 2, "Jumlah produk harus berkurang setelah delete");
assert.strictEqual(products.some((p) => p.id === "p-01"), false, "Produk p-01 harus terhapus");

console.log("Self-check logic passed successfully.");
