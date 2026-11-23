import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../lib/store";

export const Route = (createFileRoute as any)("/login")({
  component: LoginPage,
});


function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    const { error } = await signIn(email, password);
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Failed to log in.");
    } else {
      navigate({ to: "/" });
    }
  };

  if (user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>You are already signed in as {user.email}.</p>
        <Link to="/">Go to Home</Link>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: "400px", margin: "3rem auto", padding: "1.5rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Sign In</h1>

      {errorMsg && (
        <div style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="email" style={{ display: "block", marginBottom: "0.25rem" }}>Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #999", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label htmlFor="password" style={{ display: "block", marginBottom: "0.25rem" }}>Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #999", borderRadius: "4px" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{ padding: "0.6rem", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
        Don't have an account? <Link to="/register" style={{ color: "blue" }}>Register here</Link>
      </p>
    </main>
  );
}
