"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

export default function AccountPage() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 text-gray-900">

        {/* Header */}
        <nav className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight"
            >
              ABB<span className="text-green-600">Store</span>
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-green-600"
            >
              Continue Shopping
            </Link>

          </div>
        </nav>

        {/* Account */}
        <section className="mx-auto max-w-5xl px-4 py-8">

          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              My Account
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account and orders
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* My Orders */}
            <Link
              href="/orders"
              className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl">
                  📦
                </div>

                <div>
                  <h2 className="font-bold group-hover:text-green-600">
                    My Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    View your previous orders
                  </p>
                </div>

              </div>
            </Link>

            {/* Saved Addresses */}
            <div className="cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl">
                  📍
                </div>

                <div>
                  <h2 className="font-bold">
                    Saved Addresses
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your delivery addresses
                  </p>
                </div>

              </div>
            </div>

            {/* Profile */}
            <div className="cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl">
                  👤
                </div>

                <div>
                  <h2 className="font-bold">
                    Profile
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your account information
                  </p>
                </div>

              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl">
                  🔐
                </div>

                <div>
                  <h2 className="font-bold text-red-600">
                    Logout
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Sign out from your account
                  </p>
                </div>

              </div>
            </button>

          </div>

        </section>

      </main>
    </AuthGuard>
  );
}