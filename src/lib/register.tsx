import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../lib/store";

export const Route = (createFileRoute as any)("/register")({
  component: RegisterPage,
});


function RegisterPage() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const { error } = await signUp(email, password);
    setSubmitting(false);

    if (error) {
      setErrorMsg(error.message || "Failed to create account.");
    } else {
      setSuccessMsg("Registration successful! Check your email to confirm or sign in.");
      setTimeout(() => navigate({ to: "/login" }), 2000);
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
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Create Account</h1>

      {errorMsg && (
        <div style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ color: "green", marginBottom: "1rem", fontSize: "0.9rem" }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="reg-email" style={{ display: "block", marginBottom: "0.25rem" }}>Email</label>
          <input
            id="reg-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #999", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label htmlFor="reg-password" style={{ display: "block", marginBottom: "0.25rem" }}>Password</label>
          <input
            id="reg-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #999", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" style={{ display: "block", marginBottom: "0.25rem" }}>Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #999", borderRadius: "4px" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{ padding: "0.6rem", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
        Already have an account? <Link to="/login" style={{ color: "blue" }}>Sign in here</Link>
      </p>
    </main>
  );
}
