import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/store";
import {
  MOCK_PRODUCTS as SEED_PRODUCTS,
  CATEGORIES,
  filterAndSortProducts,
  type Product,
  type ProductSort,
} from "../lib/catalog";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartQuantity,
  calculateCartTotal,
  calculateShipping,
  type CartItem,
} from "../lib/cart";

export default function TestDashboardPage() {
  // ==========================================
  // 1. HAYDEN'S FEATURE: Auth & Session Handling
  // ==========================================
  const auth = useAuth();
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAuthMessage("Creating account...");
    const { error } = await auth.signUp(authEmail, authPassword);
    if (error) setAuthMessage(`❌ Register Error: ${error.message}`);
    else setAuthMessage("✅ Registration successful! Please check your email or log in.");
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAuthMessage("Signing in...");
    const { error } = await auth.signIn(authEmail, authPassword);
    if (error) setAuthMessage(`❌ Login Error: ${error.message}`);
    else setAuthMessage("✅ Logged in successfully!");
  };

  const handleLogout = async () => {
    await auth.signOut();
    setAuthMessage("Logged out.");
  };

  // ==========================================
  // 2. NABIL'S FEATURE: Product Catalogue
  // ==========================================
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<ProductSort>("featured");

  const filteredProducts = filterAndSortProducts(
    SEED_PRODUCTS,
    selectedCategory,
    searchQuery,
    sortBy
  );

  // ==========================================
  // 3. KINGSTON'S FEATURE: Shopping Cart Integration
  // ==========================================
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("tsu_cart_items_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tsu_cart_items_v1", JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  // ---- Quantity chosen on each product card ----
  const [cardQty, setCardQty] = useState<Record<string, number>>({});

  // Keep quantity between 1 and the product's available stock
  const clampQty = (product: Product, qty: number): number => {
    const safe = Math.floor(qty);
    if (Number.isNaN(safe)) return 1;
    return Math.max(1, Math.min(product.stock, safe));
  };

  const qtyFor = (product: Product): number => cardQty[product.id] ?? 1;

  const setQtyFor = (product: Product, qty: number) => {
    setCardQty((prev) => ({ ...prev, [product.id]: clampQty(product, qty) }));
  };

  // ---- Size chosen on each product card ----
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const sizeFor = (product: Product): string => {
    if (!product.sizes || product.sizes.length === 0) return "";
    return selectedSizes[product.id] ?? product.sizes[0] ?? "";
  };

  const setSizeFor = (product: Product, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [product.id]: size }));
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;

    const chosenSize = sizeFor(product);
    const qty = qtyFor(product);

    setCart((items) => addItemToCart(items, product, chosenSize, qty));
  };

  const handleQuantityChange = (key: string, delta: number) => {
    setCart((items) => {
      const item = items.find((entry) => entry.key === key);
      if (!item) return items;

      return updateCartQuantity(items, key, item.quantity + delta);
    });
  };

  const handleRemove = (key: string) => {
    setCart((items) => removeItemFromCart(items, key));
  };

  const subtotal = calculateCartTotal(cart);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "1200px", margin: "0 auto", padding: "20px", color: "#333" }}>
      {/* Header */}
      <header style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>This Side Up</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {auth.user && (
              <button
                onClick={handleLogout}
                style={{ padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
        
        {/* Left Column: Auth + Catalogue */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Section 1: Authentication */}
          <section style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", background: "#fff" }}>
            <h2 style={{ fontSize: "18px", marginTop: 0, color: "#1f2937" }}>
              1. Authentication & Session Handling <span style={{ fontSize: "12px", color: "#6b7280" }}>(Hayden)</span>
            </h2>

            {auth.user ? (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "12px", borderRadius: "6px" }}>
                <p style={{ margin: "0 0 6px", fontWeight: "bold", color: "#065f46" }}>✅ Active Session Found</p>
                <div style={{ fontSize: "13px", color: "#047857" }}>
                  <div><strong>User ID:</strong> {auth.user.id}</div>
                  <div><strong>Email:</strong> {auth.user.email}</div>
                  <div><strong>Role:</strong> {(auth as any).role ?? "user"}</div>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ margin: "4px 0 10px", fontSize: "12px", color: "#047857" }}>
                  Try registering or signing in
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, minWidth: "180px", background: "#fff" }}
                  />
                  <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, minWidth: "180px", background: "#fff" }}
                  />
                  <button
                    onClick={handleLogin}
                    style={{ padding: "8px 16px", background: "#0f766e", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleRegister}
                    style={{ padding: "8px 16px", background: "#f3f4f6", color: "#111", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Register
                  </button>
                </div>
                {authMessage && (
                  <p style={{ margin: "8px 0 0", fontSize: "13px", color: authMessage.startsWith("❌") ? "#dc2626" : "#059669" }}>
                    {authMessage}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Section 2: Product Catalogue */}
          <section style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", background: "#fff" }}>
            <h2 style={{ fontSize: "18px", marginTop: 0, color: "#1f2937" }}>
              2. Product Catalogue, Search & Filters <span style={{ fontSize: "12px", color: "#6b7280" }}>(Nabil)</span>
            </h2>

            {/* Filter controls */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", flex: 1, minWidth: "200px", background: "#fff" }}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff" }}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat: string) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(event) => {
                  const value = event.target.value;
                  if (
                    value === "featured" ||
                    value === "az" ||
                    value === "za" ||
                    value === "low" ||
                    value === "high"
                  ) {
                    setSortBy(value);
                  }
                }}
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px", background: "#fff" }}
              >
                <option value="featured">Sort: Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="az">Name: A to Z</option>
                <option value="za">Name: Z to A</option>
              </select>
            </div>

            {/* Product Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {filteredProducts.map((product: Product) => {
                const qty = qtyFor(product);
                const inStock = product.stock > 0;

                return (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      background: "#fafafa",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#6b7280", fontWeight: "bold" }}>
                        {product.category}
                      </span>
                      <h3 style={{ margin: "4px 0 6px", fontSize: "15px", color: "#111" }}>
                        {product.name}
                      </h3>
                      <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#666", lineHeight: 1.4 }}>
                        {product.blurb}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "bold", color: "#0f766e" }}>
                          ${product.price}
                        </span>
                        <span style={{ fontSize: "12px", color: inStock ? "#059669" : "#dc2626" }}>
                          {inStock ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </div>

                      {/* Size dropdown (if product has sizes) */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>Size</span>
                          <select
                            value={sizeFor(product)}
                            disabled={!inStock}
                            onChange={(e) => setSizeFor(product, e.target.value)}
                            style={{
                              flex: 1,
                              padding: "4px 8px",
                              border: "1px solid #ccc",
                              borderRadius: "3px",
                              background: "#fff",
                              fontSize: "12px",
                            }}
                          >
                            {product.sizes.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Quantity picker on the product card */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>Qty</span>
                        <button
                          type="button"
                          onClick={() => setQtyFor(product, qty - 1)}
                          disabled={!inStock || qty <= 1}
                          style={{
                            width: "26px",
                            height: "26px",
                            background: "#e5e7eb",
                            border: "none",
                            borderRadius: "3px",
                            cursor: !inStock || qty <= 1 ? "not-allowed" : "pointer",
                            opacity: !inStock || qty <= 1 ? 0.5 : 1,
                          }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={product.stock}
                          value={qty}
                          disabled={!inStock}
                          onChange={(e) => setQtyFor(product, Number(e.target.value))}
                          style={{
                            width: "48px",
                            padding: "4px",
                            textAlign: "center",
                            border: "1px solid #ccc",
                            borderRadius: "3px",
                            background: "#fff",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setQtyFor(product, qty + 1)}
                          disabled={!inStock || qty >= product.stock}
                          style={{
                            width: "26px",
                            height: "26px",
                            background: "#e5e7eb",
                            border: "none",
                            borderRadius: "3px",
                            cursor: !inStock || qty >= product.stock ? "not-allowed" : "pointer",
                            opacity: !inStock || qty >= product.stock ? 0.5 : 1,
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock}
                        style={{
                          width: "100%",
                          padding: "8px",
                          background: inStock ? "#0f766e" : "#d1d5db",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: inStock ? "pointer" : "not-allowed",
                          fontWeight: "bold",
                          fontSize: "13px",
                        }}
                      >
                        {inStock ? `+ Add ${qty} to Cart` : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Mini Cart Sidebar */}
        <aside>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "16px",
              background: "#fff",
              position: "sticky",
              top: "20px",
            }}
          >
            <h2 style={{ fontSize: "18px", marginTop: 0, color: "#1f2937", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
              3. Shopping Cart <span style={{ fontSize: "12px", color: "#6b7280" }}>(Kingston)</span>
            </h2>

            {cart.length === 0 ? (
              <p style={{ color: "#6b7280", fontSize: "14px", padding: "20px 0", textAlign: "center" }}>
                Your cart is empty.
              </p>
            ) : (
              <div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
                  {cart.map((item) => (
                    <li
                      key={item.key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: "8px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "bold" }}>{item.product.name}</div>
                        {item.size && (
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>Size: {item.size}</div>
                        )}
                        <div style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button
                          onClick={() => handleQuantityChange(item.key, -1)}
                          style={{ width: "24px", height: "24px", background: "#e5e7eb", border: "none", borderRadius: "3px", cursor: "pointer" }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: "13px", width: "20px", textAlign: "center" }}>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.key, 1)}
                          style={{ width: "24px", height: "24px", background: "#e5e7eb", border: "none", borderRadius: "3px", cursor: "pointer" }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemove(item.key)}
                          style={{ marginLeft: "6px", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Calculation breakdown using cart.ts */}
                <div style={{ fontSize: "13px", borderTop: "2px solid #e5e7eb", paddingTop: "12px", lineHeight: "1.8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#4b5563" }}>
                    <span>Delivery:</span>
                    <span>{shipping === 0 ? "FREE (Over $150)" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "15px", borderTop: "1px dashed #ccc", paddingTop: "6px", marginTop: "4px" }}>
                    <span>Total:</span>
                    <span style={{ color: "#0f766e" }}>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <a
                    href="/cart"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "10px",
                      background: "#0284c7",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}
                  >
                    Check Out &rarr;
                  </a>
                  <button
                    onClick={() => setCart([])}
                    style={{ padding: "6px", background: "#f3f4f6", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", color: "#666" }}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
