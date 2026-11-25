// src/routes/cart.tsx - Shopping Cart Page Skeleton
import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  type CartItem,
  addItemToCart,
  removeItemFromCart,
  updateCartQuantity,
  calculateCartTotal,
  calculateShipping,
} from "../lib/cart";

export const Route = (createFileRoute as any)("/cart")({
  component: CartPage,
});

// Demo seed items so you can test add/remove/quantity right away
const SEED_CART: CartItem[] = [
  {
    key: "p1-Standard",
    product: {
      id: "p1",
      name: "Tide Classic Fiberglass 48\"",
      price: 189,
      stock: 5,
    },
    size: "Standard",
    quantity: 1,
  },
  {
    key: "p2-Large",
    product: {
      id: "p2",
      name: "Rip Curl Quick-Dry Rashguard",
      price: 49,
      stock: 8,
    },
    size: "Large",
    quantity: 2,
  },
];

const STORAGE_KEY = "prototype_shopping_cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_CART;
    } catch {
      return SEED_CART;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const handleUpdateQty = (key: string, qty: number) => {
    setCart((prev) => updateCartQuantity(prev, key, qty));
  };

  const handleRemove = (key: string) => {
    setCart((prev) => removeItemFromCart(prev, key));
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCart([]);
    }
  };

  const handleResetSample = () => {
    setCart(SEED_CART);
  };

  const subtotal = calculateCartTotal(cart);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const itemCount = cart.reduce((count, i) => count + i.quantity, 0);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "2px solid #ddd", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <h1>Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})</h1>
        <p style={{ color: "#666" }}>Review, update quantities, or remove items from your order.</p>
      </header>

      {cart.length === 0 ? (
        <div style={{ padding: "3rem 1rem", textAlign: "center", border: "1px dashed #ccc", borderRadius: "8px" }}>
          <h2>Your cart is currently empty</h2>
          <p style={{ color: "#777", marginBottom: "1.5rem" }}>Looks like you haven't added any products yet.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link
              to="/products"
              style={{ padding: "0.6rem 1.2rem", background: "#333", color: "#fff", textDecoration: "none", borderRadius: "4px" }}
            >
              Browse Products
            </Link>
            <button
              onClick={handleResetSample}
              style={{ padding: "0.6rem 1.2rem", background: "#eee", border: "1px solid #ccc", cursor: "pointer", borderRadius: "4px" }}
            >
              Load Sample Items
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Cart Items List */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                <th style={{ padding: "0.5rem" }}>Product</th>
                <th style={{ padding: "0.5rem" }}>Price</th>
                <th style={{ padding: "0.5rem" }}>Quantity</th>
                <th style={{ padding: "0.5rem" }}>Subtotal</th>
                <th style={{ padding: "0.5rem" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.key} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    <strong>{item.product.name}</strong>
                    {item.size && (
                      <div style={{ fontSize: "0.85rem", color: "#666" }}>Size: {item.size}</div>
                    )}
                    <div style={{ fontSize: "0.8rem", color: "#999" }}>Max stock: {item.product.stock}</div>
                  </td>
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    SGD {item.product.price.toFixed(2)}
                  </td>
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleUpdateQty(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ width: "28px", height: "28px", cursor: item.quantity <= 1 ? "not-allowed" : "pointer" }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: "24px", textAlign: "center", fontWeight: "bold" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.key, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        style={{ width: "28px", height: "28px", cursor: item.quantity >= item.product.stock ? "not-allowed" : "pointer" }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 0.5rem", fontWeight: "bold" }}>
                    SGD {(item.product.price * item.quantity).toFixed(2)}
                  </td>
                  <td style={{ padding: "0.75rem 0.5rem" }}>
                    <button
                      onClick={() => handleRemove(item.key)}
                      style={{ color: "#c00", border: "1px solid #fcc", background: "#fff", padding: "0.25rem 0.5rem", cursor: "pointer", borderRadius: "3px" }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cart Summary and Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <button
                onClick={handleClear}
                style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", background: "#fafafa", cursor: "pointer", borderRadius: "4px" }}
              >
                Clear Cart
              </button>
              <Link
                to="/products"
                style={{ display: "inline-block", marginLeft: "1rem", color: "#555", textDecoration: "underline" }}
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Price Breakdown */}
            <div style={{ background: "#f9f9f9", padding: "1.25rem", borderRadius: "6px", width: "280px", border: "1px solid #eee" }}>
              <h3 style={{ margin: "0 0 1rem 0" }}>Order Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Subtotal:</span>
                <span>SGD {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span>Delivery:</span>
                <span>{shipping === 0 ? "FREE" : `SGD ${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.5rem" }}>
                  Free shipping on orders SGD 150+
                </div>
              )}
              <hr style={{ border: "0", borderTop: "1px solid #ddd", margin: "0.75rem 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: "bold" }}>
                <span>Total:</span>
                <span>SGD {total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => alert("Checkout flow is handled in the next sprint!")}
                style={{ width: "100%", marginTop: "1rem", padding: "0.75rem", background: "#222", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
