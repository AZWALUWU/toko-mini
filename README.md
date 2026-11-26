# Toko Online Mini (WhatsApp Checkout & Cloudflare D1 Admin)

Aplikasi toko online mini berbasis web untuk melatih manajemen state keranjang belanja, alur checkout langsung ke WhatsApp penjual, filter produk, dan panel admin pengelola inventori dengan Cloudflare D1 Database.

## Fitur Utama

### 1. Belanja & Checkout (Mode Pembeli)
- **Katalog & Filter Produk**: Pencarian nama/deskripsi produk secara langsung dan filter berbasis kategori.
- **Manajemen Keranjang Belanja (`useCart`)**:
  - Tambah barang, ubah kuantitas, hapus barang, dan kosongkan keranjang.
  - Data keranjang tersimpan otomatis di `localStorage`.
- **Checkout WhatsApp Langsung**:
  - Form pengisian data penerima (nama, nomor WA, alamat lengkap).
  - Validasi formulir dengan feedback pesan yang jelas.
  - Generate pesan order terformat dan membuka chat WhatsApp penjual via tautan `https://wa.me/...`.

### 2. Panel Pengelola Toko (Mode Admin / CRUD)
- **Proteksi PIN Pengelola**: Akses panel admin diamankan dengan PIN 6 digit (PIN bawaan: `123456`).
- **Tambah Produk (Create)**: Formulir penambahan produk dengan input nama, kategori, harga, satuan, stok, foto, dan deskripsi.
- **Ubah Produk (Update)**: Edit informasi dan jumlah stok produk secara langsung.
- **Hapus Produk (Delete)**: Penghapusan produk dengan modal konfirmasi aman.
- **Multi-storage Resilience**: Terhubung ke database Cloudflare D1 via Pages Functions `/api/products` dengan fallback otomatis ke penyimpanan lokal browser saat mode offline.

### 3. Desain & Aksesibilitas
- Target sentuh tombol mobile minimal 44x44px.
- Dukungan navigasi keyboard penuh (Tab, Enter, Escape untuk menutup modal/drawer).
- Rasio kontras warna teks memenuhi standar WCAG AA.
- Bebas karakter em dash dan copy alami tanpa buzzword.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Komponen UI Primitives
- **Database & Edge API**: Cloudflare D1 Database + Cloudflare Pages Functions
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

## Setup Cloudflare D1 Database (Opsional untuk Online Sync)

1. Buat database D1 di Cloudflare:
   ```bash
   npx wrangler d1 create toko-mini-db
   ```
2. Jalankan migrasi tabel awal:
   ```bash
   npx wrangler d1 execute toko-mini-db --remote --file=./migrations/0001_init.sql
   ```
3. Di Cloudflare Dashboard > **Pages** > **Settings** > **Functions** > **D1 Database Bindings**:
   - Variable name: `DB`
   - D1 database: pilih `toko-mini-db`.

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
