# Toko Online Mini (Direct WhatsApp Checkout)

Aplikasi toko online mini berbasis web untuk melatih manajemen state keranjang belanja, alur checkout langsung ke WhatsApp penjual, dan filter produk dengan desain bersih berstandar aksesibilitas tinggi.

## Fitur Utama

- **Katalog & Filter Produk**: Pencarian nama/deskripsi produk secara langsung dan filter berbasis kategori.
- **Manajemen Keranjang Belanja (`useCart`)**:
  - Tambah barang, ubah kuantitas, hapus barang, dan kosongkan keranjang.
  - Data tersinkronisasi otomatis dengan `localStorage`.
- **Checkout WhatsApp Langsung**:
  - Form pengisian data penerima (nama, nomor WA, alamat lengkap).
  - Validasi formulir dengan feedback pesan yang jelas.
  - Generate pesan order terformat dan membuka chat WhatsApp penjual via tautan `https://wa.me/...`.
- **Desain & Aksesibilitas**:
  - Target sentuh tombol mobile minimal 44x44px.
  - Dukungan navigasi keyboard penuh (Tab, Enter, Escape untuk menutup modal/drawer).
  - Rasio kontras warna teks memenuhi standar WCAG AA.
  - Bebas karakter em dash dan copy alami tanpa buzzword.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Komponen UI Primitives
- **Icons**: Lucide React
- **Hosting**: Cloudflare Pages (Free Tier)

## Menjalankan di Lokal

1. Clone repository:
   ```bash
   git clone https://github.com/AZWALUWU/toko-mini.git
   cd toko-mini
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Jalankan build produksi:
   ```bash
   npm run build
   ```

## Deployment ke Cloudflare Pages (Free Tier)

Proyek ini telah dikonfigurasi dengan file `public/_redirects` untuk mendukung Single Page Application (SPA).

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Pilih **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Hubungkan repository `AZWALUWU/toko-mini`.
4. Konfigurasi build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Klik **Save and Deploy**.
