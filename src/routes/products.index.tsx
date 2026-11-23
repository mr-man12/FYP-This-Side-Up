import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MOCK_PRODUCTS,
  CATEGORIES,
  filterAndSortProducts,
  ProductSort,
} from "../lib/catalog";

export const Route = (createFileRoute as any)("/products/")({
  component: ProductsIndexPage,
});

function ProductsIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ProductSort>("featured");

  const filtered = filterAndSortProducts(
    MOCK_PRODUCTS,
    selectedCategory,
    searchQuery,
    sortBy
  );

  return (
    <main style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Product Catalogue</h1>
        <p style={{ color: "#666" }}>Explore skimboards, apparel, and beach gear.</p>
      </header>

      {/* Search and Sort Controls */}
      <section style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: "1", minWidth: "220px", padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as ProductSort)}
          style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="featured">Sort: Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="az">Name: A to Z</option>
          <option value="za">Name: Z to A</option>
        </select>
      </section>

      {/* Category Filter Pills */}
      <nav style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "20px",
              border: "1px solid #333",
              background: selectedCategory === cat ? "#000" : "#fff",
              color: selectedCategory === cat ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
          No products matched your search.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {filtered.map((product) => (
            <article
              key={product.id}
              style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#888", marginBottom: "0.25rem" }}>
                  {product.category}
                </span>
                <h2 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>{product.name}</h2>
                <p style={{ fontSize: "0.9rem", color: "#666", flex: 1, margin: "0 0 1rem 0" }}>
                  {product.blurb}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>${product.price}</span>
                  <Link
                    to={`/products/${product.id}` as any}
                    style={{
                      padding: "0.4rem 0.8rem",
                      background: "#000",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
