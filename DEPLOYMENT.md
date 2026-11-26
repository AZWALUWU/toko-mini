# Panduan Deployment Cloudflare Pages (Free Tier)

Aplikasi Toko Online Mini ini adalah static Single Page Application (SPA) yang 100% kompatibel dan gratis selamanya di Cloudflare Pages Free Tier.

## Opsi 1: Menghubungkan Git Repository (Rekomendasi)

1. Buat repository baru di GitHub, lalu push kode project:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi toko online mini checkout whatsapp"
   git branch -M main
   git remote add origin https://github.com/<username>/toko-mini.git
   git push -u origin main
   ```
2. Buka dashboard Cloudflare: [dash.cloudflare.com](https://dash.cloudflare.com).
3. Masuk ke menu **Compute (Workers & Pages)** > **Create application** > tab **Pages** > **Connect to Git**.
4. Pilih repository `toko-mini`.
5. Pada bagian **Build settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Klik **Save and Deploy**. Website Anda langsung online di domain `*.pages.dev`.

## Opsi 2: Deploy Langsung via Wrangler CLI

Jalankan perintah ini dari folder project:
```bash
npx wrangler pages deploy dist --project-name=toko-mini
```
*Catatan: Pastikan Anda sudah login ke akun Cloudflare di terminal (`npx wrangler login`).*
