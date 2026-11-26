# Panduan Deployment Cloudflare Pages & D1 Database (Free Tier)

Aplikasi Toko Online Mini ini adalah static Single Page Application (SPA) dengan Pages Functions dan Cloudflare D1 Database yang 100% gratis di Cloudflare Free Tier.

## Langkah 1: Push ke GitHub Repository

```bash
git add .
git commit -m "feat: tambahkan fitur panel admin CRUD produk dan Cloudflare D1"
git push origin main
```

## Langkah 2: Deploy di Cloudflare Pages

1. Buka dashboard Cloudflare: [dash.cloudflare.com](https://dash.cloudflare.com).
2. Masuk ke menu **Compute (Workers & Pages)** > **Create application** > tab **Pages** > **Connect to Git**.
3. Pilih repository `toko-mini`.
4. Pada bagian **Build settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Klik **Save and Deploy**. Website Anda langsung online di domain `*.pages.dev`.

## Langkah 3: Menghubungkan D1 Database (Sinkronisasi Multi-Device)

1. Buka menu **Storage & Databases** > **D1 SQL Database** > **Create database**.
2. Beri nama `toko-mini-db`.
3. Buka tab **Console** pada database tersebut, jalankan isi file `migrations/0001_init.sql` untuk membuat tabel dan 10 data produk awal.
4. Buka kembali aplikasi Pages Anda di **Workers & Pages** > `toko-mini` > **Settings** > **Functions** > **D1 database bindings**:
   - Klik **Add binding**.
   - Variable name: `DB`
   - Database: `toko-mini-db`
5. Lakukan redeploy atau trigger deploy ulang agar binding aktif.
