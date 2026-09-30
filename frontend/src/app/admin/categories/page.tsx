"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AdminGuard from "@/components/AdminGuard";
import { apiFetch } from "@/lib/api";

interface Category {
  ID: number;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const data = await apiFetch("/categories");
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setCreating(true);
    setError("");

    try {
      const newCategory = await apiFetch("/admin/categories", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      setCategories((current) => [...current, newCategory]);
      setName("");

      alert("Category created successfully!");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create category"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50 text-gray-900">

        <nav className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            <Link
              href="/admin"
              className="text-2xl font-bold"
            >
              ABB Admin
            </Link>

            <Link
              href="/admin"
              className="text-gray-600 hover:text-black"
            >
              ← Dashboard
            </Link>

          </div>
        </nav>

        <section className="mx-auto max-w-4xl px-6 py-12">

          <h1 className="text-3xl font-bold">
            Categories
          </h1>

          <p className="mt-2 text-gray-500">
            Create and manage product categories.
          </p>

          {/* Create Category */}

          <form
            onSubmit={createCategory}
            className="mt-8 flex gap-3 rounded-xl bg-white p-6 shadow-sm"
          >

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
              className="flex-1 rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {creating ? "Adding..." : "Add Category"}
            </button>

          </form>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Categories */}

          {loading ? (

            <p className="mt-8 text-gray-500">
              Loading categories...
            </p>

          ) : categories.length === 0 ? (

            <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No categories found.
              </p>
            </div>

          ) : (

            <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">

              {categories.map((category) => (

                <div
                  key={category.ID}
                  className="flex items-center justify-between border-b px-6 py-4 last:border-0"
                >

                  <div>
                    <p className="font-medium">
                      {category.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      ID: {category.ID}
                    </p>
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>
    </AdminGuard>
  );
}