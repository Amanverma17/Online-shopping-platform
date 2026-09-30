"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AdminGuard from "@/components/AdminGuard";
import { apiFetch } from "@/lib/api";

interface Category {
  ID: number;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/categories")
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/admin/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          category_id: Number(categoryId),
        }),
      });

      alert("Product created successfully!");

      router.push("/admin/products");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create product"
      );
    } finally {
      setLoading(false);
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
              href="/admin/products"
              className="text-gray-600 hover:text-black"
            >
              ← Products
            </Link>

          </div>
        </nav>

        <section className="mx-auto max-w-2xl px-6 py-12">

          <h1 className="text-3xl font-bold">
            Add Product
          </h1>

          <p className="mt-2 text-gray-500">
            Create a new product for your store.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-xl bg-white p-8 shadow-sm"
          >

            <div>
              <label className="mb-2 block font-medium">
                Product Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
                rows={4}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Stock
              </label>

              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                placeholder="0"
              />
            </div>

            {/* Category */}

            <div>
              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                disabled={loadingCategories}
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-black"
              >

                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.ID}
                    value={category.ID}
                  >
                    {category.name}
                  </option>
                ))}

              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-3 font-semibold text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading
                ? "Creating Product..."
                : "Create Product"}
            </button>

          </form>

        </section>

      </main>
    </AdminGuard>
  );
}