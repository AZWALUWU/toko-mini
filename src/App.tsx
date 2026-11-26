import { useState, useMemo } from "react";
import type { ProductCategory, Product } from "./types";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { Navbar } from "./components/Navbar";
import { ProductFilter } from "./components/ProductFilter";
import { ProductCard } from "./components/ProductCard";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminPinModal } from "./components/admin/AdminPinModal";
import { Footer } from "./components/Footer";
import { Button } from "./components/ui/button";
import { ShoppingBag, SearchX } from "lucide-react";

export function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPin, setAdminPin] = useState("123456");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("Semua");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Dynamic products from Cloudflare D1 / LocalStorage
  const {
    products,
    syncStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaults,
  } = useProducts();

  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  // Filter products by category and search keyword
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === "Semua" || product.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    clearCart();
  };

  const handleToggleAdmin = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handlePinSuccess = (enteredPin: string) => {
    setAdminPin(enteredPin);
    setIsAdminMode(true);
  };

  const handleAddProduct = (data: Omit<Product, "id">) => {
    addProduct(data, adminPin);
  };

  const handleUpdateProduct = (product: Product) => {
    updateProduct(product, adminPin);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId, adminPin);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      {/* Navigation Bar */}
      <Navbar
        totalItems={totalItems}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminMode={isAdminMode}
        onToggleAdmin={handleToggleAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {isAdminMode ? (
          /* Admin View (CRUD Produk) */
          <AdminDashboard
            products={products}
            syncStatus={syncStatus}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetDefaults={resetToDefaults}
            onExitAdmin={() => setIsAdminMode(false)}
          />
        ) : (
          /* Buyer View (Etalase Belanja) */
          <>
            {/* Banner Sederhana */}
            <section className="mb-8 p-6 sm:p-8 rounded-xl bg-emerald-800 text-white shadow-sm">
              <div className="max-w-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                  Katalog Sembako & Kebutuhan Rumah Tangga
                </h1>
                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                  Pilih kebutuhan harian keluarga Anda, masukkan ke keranjang belanja, dan kirimkan pesanan langsung ke WhatsApp admin kami untuk konfirmasi pengiriman.
                </p>
              </div>
            </section>

            {/* Filter & Search Bar */}
            <section aria-label="Filter dan Pencarian Produk" className="mb-8">
              <ProductFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                totalResults={filteredProducts.length}
              />
            </section>

            {/* Product Catalog Grid */}
            <section aria-label="Daftar Produk">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State Filter (R-27) */
                <div className="bg-white border border-zinc-200 rounded-xl p-8 sm:p-12 text-center max-w-md mx-auto my-8">
                  <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
                    <SearchX className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h2 className="text-base font-semibold text-zinc-900 mb-1">
                    Produk Tidak Ditemukan
                  </h2>
                  <p className="text-xs text-zinc-500 mb-6">
                    Tidak ada produk yang cocok dengan kata kunci atau kategori yang Anda pilih.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="min-h-[44px]"
                  >
                    Reset Filter Pencarian
                  </Button>
                </div>
              )}
            </section>

            {/* Floating Quick Cart for Mobile Thumb Access */}
            {totalItems > 0 && !isCartOpen && !isCheckoutOpen && (
              <aside className="fixed bottom-4 right-4 sm:hidden z-20">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-2.5 min-h-[48px] px-5 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  aria-label={`Buka keranjang belanja, ${totalItems} barang`}
                >
                  <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                  <span>Keranjang ({totalItems})</span>
                </button>
              </aside>
            )}
          </>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        totalPrice={totalPrice}
        totalItems={totalItems}
        onUpdateQty={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Admin PIN Prompt Modal */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* Footer Landmark */}
      <Footer />
    </div>
  );
}

export default App;
