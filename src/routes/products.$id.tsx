import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MOCK_PRODUCTS } from "../lib/catalog";

export const Route = (createFileRoute as any)("/products/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const params: any = useParams({ strict: false });
  const productId = params?.id;
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);

  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes ? product.sizes[0] : ""
  );
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main style={{ maxWidth: "800px", margin: "3rem auto", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>Product Not Found</h1>
        <p>The product you are looking for does not exist.</p>
        <Link to={"/products" as any} style={{ color: "blue" }}>
          &larr; Back to all products
        </Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    // Basic local cart simulation for evaluation demo
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");
    existing.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || undefined,
      quantity: 1,
      image: product.image,
    });
    localStorage.setItem("cart", JSON.stringify(existing));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <main style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem", fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link to={"/products" as any} style={{ color: "#444", textDecoration: "none" }}>
          &larr; Back to Catalogue
        </Link>
      </nav>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "#888" }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>{product.name}</h1>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>${product.price}</p>
          <p style={{ color: "#555", lineHeight: "1.6" }}>{product.blurb}</p>

          <p style={{ fontSize: "0.9rem", color: product.stock > 5 ? "green" : "orange" }}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of stock"}
          </p>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Select Size:
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      background: selectedSize === s ? "#000" : "#fff",
                      color: selectedSize === s ? "#fff" : "#000",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            <button
              type="button"
              onClick={handleAddToCart}
              style={{
                width: "100%",
                padding: "0.8rem",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
            {added && (
              <p style={{ color: "green", fontSize: "0.9rem", marginTop: "0.5rem", textAlign: "center" }}>
                Added to cart!
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
