"use client";

import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50 text-gray-900">

        {/* Navbar */}
        <nav className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            <Link
              href="/"
              className="text-2xl font-bold"
            >
              ABB Store
            </Link>

            <Link
              href="/"
              className="text-gray-600 hover:text-black"
            >
              Back to Store
            </Link>

          </div>
        </nav>

        {/* Dashboard */}
        <section className="mx-auto max-w-7xl px-6 py-12">

          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your ABB Store
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {/* Products */}
            <Link
              href="/admin/products"
              className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-xl font-bold">
                Products
              </h2>

              <p className="mt-2 text-gray-500">
                Add, edit and delete products.
              </p>
            </Link>

            {/* Categories */}
            <Link
              href="/admin/categories"
              className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-xl font-bold">
                Categories
              </h2>

              <p className="mt-2 text-gray-500">
                Manage product categories.
              </p>
            </Link>

            {/* Orders */}
            <Link
              href="/admin/orders"
              className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-xl font-bold">
                Orders
              </h2>

              <p className="mt-2 text-gray-500">
                View and manage customer orders.
              </p>
            </Link>

          </div>

        </section>

      </main>
    </AdminGuard>
  );
}