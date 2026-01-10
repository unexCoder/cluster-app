"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { login, setToken } from "@/lib/auth-client";
import styles from './registerForm.module.css'

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const validatedData = loginSchema.parse(formData);

      // Call login function from auth utilities
      const response = await login({
        email: validatedData.email,
        password: validatedData.password,
      });
      
      // Store token
      if (response?.token) {
        setToken(response.token);
        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("No token received from server");
        setLoading(false);
      }
    } catch (err: any) {
      const errorMsg = err.message || err?.response?.data?.error || "Something went wrong";
      setError(errorMsg);
      setLoading(false);
      console.error("Login error:", err);
    }
  };

  

  return (
    <form onSubmit={handleSubmit}>

      <div className={styles.formGroup}>
        <label htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={styles.submitButton}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}