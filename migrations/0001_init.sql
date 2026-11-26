-- Migration 0001_init.sql: Inisialisasi tabel produk
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  unit TEXT NOT NULL,
  stock INTEGER NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed data 10 produk bawaan
INSERT OR IGNORE INTO products (id, name, category, price, unit, stock, description, image) VALUES
  ('p-01', 'Beras Pandan Wangi 5 Kg', 'Bahan Pokok', 74000, 'karung 5kg', 25, 'Beras pulen aromatik kualitas super tanpa pemutih dan tanpa pengawet sintetis.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'),
  ('p-02', 'Minyak Goreng Kelapa Sawit 2 Liter', 'Bahan Pokok', 35000, 'pouch 2L', 40, 'Minyak goreng jernih dua kali penyaringan, kaya vitamin A untuk menggoreng renyah.', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'),
  ('p-03', 'Gula Pasir Kristal Putih 1 Kg', 'Bahan Pokok', 17500, 'kemasan 1kg', 30, 'Gula tebu murni butiran bersih dan mudah larut untuk konsumsi keluarga harian.', 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80'),
  ('p-04', 'Telur Ayam Negeri Segar 1 Kg', 'Bahan Pokok', 28000, 'kemasan 1kg', 18, 'Telur ayam segar langsung dari peternakan binaan lokal, cangkang kokoh dan higienis.', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80'),
  ('p-05', 'Kopi Robusta Asli Lampung 250 Gram', 'Minuman', 26000, 'pouch 250g', 22, 'Biji kopi robusta sangrai medium-dark dengan aroma harum dan rasa mantap.', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80'),
  ('p-06', 'Teh Celup Melati 25 Kantong', 'Minuman', 9500, 'kotak 25 kantong', 50, 'Daun teh pilihan berpadu melati alami, menghasilkan seduhan harum menenangkan.', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'),
  ('p-07', 'Kecap Manis Kedelai Hitam 550 ml', 'Bumbu Dapur', 22000, 'botol 550ml', 35, 'Kecap kental gurih dibuat dari kedelai hitam pilihan dan gula kelapa alami.', 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80'),
  ('p-08', 'Garam Dapur Beryodium Halus 500 Gram', 'Bumbu Dapur', 6000, 'bungkus 500g', 60, 'Garam beryodium murni standar kesehatan nasional untuk kelezatan masakan keluarga.', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'),
  ('p-09', 'Sabun Cuci Piring Ekstrak Jeruk Nipis 750 ml', 'Kebersihan', 15500, 'refill 750ml', 40, 'Formula ampuh angkat lemak membandel dan bau amis dengan wangi segar jeruk nipis.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80'),
  ('p-10', 'Deterjen Konsentrat Lembut 800 Gram', 'Kebersihan', 21000, 'kemasan 800g', 20, 'Deterjen anti bakteri menjaga serat pakaian tetap cerah dan lembut di tangan.', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80');
