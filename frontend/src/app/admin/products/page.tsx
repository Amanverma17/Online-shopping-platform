"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import AdminGuard from "@/components/AdminGuard";

interface Product {
  ID: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: {
    ID: number;
    name: string;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await apiFetch("/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/admin/products/${id}`, {
        method: "DELETE",
      });

      setProducts((current) =>
        current.filter((product) => product.ID !== id)
      );

      alert("Product deleted successfully");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete product"
      );
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

        <section className="mx-auto max-w-7xl px-6 py-10">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                Products
              </h1>

              <p className="mt-1 text-gray-500">
                Manage your store products
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
            >
              + Add Product
            </Link>

          </div>

          {loading ? (

            <div className="mt-10 text-gray-500">
              Loading products...
            </div>

          ) : products.length === 0 ? (

            <div className="mt-10 rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">
                No products found.
              </p>
            </div>

          ) : (

            <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">

              <table className="w-full">

                <thead className="border-b bg-gray-50">
                  <tr>

                    <th className="px-6 py-4 text-left">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr
                      key={product.ID}
                      className="border-b last:border-0"
                    >

                      <td className="px-6 py-4 font-medium">
                        {product.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {product.category?.name || "—"}
                      </td>

                      <td className="px-6 py-4">
                        ₹{product.price}
                      </td>

                      <td className="px-6 py-4">
                        {product.stock}
                      </td>

                      <td className="px-6 py-4 text-right">

                        <div className="flex justify-end gap-3">

                          <Link
                            href={`/admin/products/${product.ID}`}
                            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              deleteProduct(product.ID)
                            }
                            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>
    </AdminGuard>
  );
}