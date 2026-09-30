"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { apiFetch } from "@/lib/api";
import { Product } from "@/types/product";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;

    apiFetch(`/products/${id}`)
      .then(setProduct)
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <p>Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Product not found
          </h1>

          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-black px-5 py-2 text-white"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      router.push("/login");
      return;
    }

    try {
      setAdding(true);

      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          product_id: product.ID,
          quantity: quantity,
        }),
      });

      alert("Product added to cart!");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to add product to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-2xl font-bold text-gray-900"
          >
            ABB Store
          </Link>

          <Link
            href="/cart"
            className="font-medium text-gray-700 hover:text-black"
          >
            🛒 Cart
          </Link>

        </div>
      </nav>

      {/* Product */}
      <section className="mx-auto max-w-6xl px-6 py-12">

        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to products
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-2">

          {/* Product Image */}
          <div className="flex h-[500px] items-center justify-center rounded-2xl bg-white shadow-sm">

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-gray-400">
                Product Image
              </span>
            )}

          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-medium text-gray-500">
              {product.category?.name}
            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-6 text-gray-600">
              {product.description}
            </p>

            <p className="mt-6 text-3xl font-bold text-gray-900">
              ₹{product.price}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {product.stock} items available
            </p>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-4">

              <span className="font-medium text-gray-900">
                Quantity
              </span>

              <div className="flex items-center rounded-lg border border-gray-300 bg-white">

                <button
                  onClick={() =>
                    setQuantity(Math.max(1, quantity - 1))
                  }
                  className="px-4 py-2 text-lg text-gray-900 hover:bg-gray-100"
                >
                  −
                </button>

                <span className="px-5 text-gray-900">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stock, quantity + 1)
                    )
                  }
                  className="px-4 py-2 text-lg text-gray-900 hover:bg-gray-100"
                >
                  +
                </button>

              </div>

            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="mt-8 w-full rounded-xl bg-black py-4 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {product.stock === 0
                ? "Out of Stock"
                : adding
                  ? "Adding..."
                  : "Add to Cart"}
            </button>

          </div>
        </div>

      </section>

    </main>
  );
}