"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      localStorage.setItem("token", data.token);

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-2xl font-bold text-green-600"
          >
            ABB Store
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-black"
          >
            ← Back to Store
          </Link>

        </div>
      </nav>

      {/* Login */}
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-sm">

          {/* Logo */}
          <div className="flex justify-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-500 text-xl font-bold text-white">
              ABB
            </div>

          </div>

          <h1 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Welcome to ABB Store
          </h1>

          <p className="mt-2 text-center text-gray-500">
            Login to continue shopping
          </p>

          {/* Form */}
          <div className="mt-8 space-y-4">

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </div>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-gray-500">

            Don't have an account?{" "}

            <Link
              href="/register"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Create account
            </Link>

          </p>

          <p className="mt-6 text-center text-xs text-gray-400">
            By continuing, you agree to our Terms of Service & Privacy Policy
          </p>

        </div>

      </div>

    </main>
  );
}