export type ProductCategory = "Semua" | "Bahan Pokok" | "Minuman" | "Bumbu Dapur" | "Kebersihan";

export interface Product {
  id: string;
  name: string;
  category: Exclude<ProductCategory, "Semua">;
  price: number;
  unit: string;
  stock: number;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}
