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
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error("Product error:", error);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>

          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-green-600 px-5 py-2 text-white"
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
          quantity,
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
            className="text-3xl font-extrabold tracking-tight"
          >
            ABB<span className="text-green-600">Store</span>
          </Link>

          <Link
            href="/cart"
            className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
          >
            🛒 Cart
          </Link>

        </div>
      </nav>

      {/* Product page */}
      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* Back */}
        <Link
          href="/"
          className="text-sm font-medium text-gray-500 hover:text-green-600"
        >
          ← Back to products
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-2">

          {/* ================= IMAGE ================= */}
          <div className="flex h-[550px] items-center justify-center rounded-2xl border bg-white p-8">

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-gray-400">
                Product Image
              </div>
            )}

          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex flex-col justify-center">

            {/* Category */}
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {product.category?.name}
            </p>

            {/* Name */}
            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-2">
              <span className="rounded bg-green-600 px-2 py-1 text-sm font-bold text-white">
                ★ 4.5
              </span>

              <span className="text-sm text-gray-500">
                Trusted product
              </span>
            </div>

            {/* Description */}
            <div className="mt-7">
              <h2 className="text-lg font-bold">
                Description
              </h2>

              <p className="mt-2 leading-6 text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="mt-7">
              <p className="text-3xl font-bold text-gray-900">
                ₹{product.price}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Inclusive of all applicable taxes
              </p>
            </div>

            {/* Stock */}
            <div className="mt-6">
              {product.stock > 0 ? (
                <p className="font-semibold text-green-600">
                  ● In Stock{" "}
                  <span className="font-normal text-gray-500">
                    ({product.stock} available)
                  </span>
                </p>
              ) : (
                <p className="font-semibold text-red-600">
                  Out of Stock
                </p>
              )}
            </div>

            <div className="my-7 border-t" />

            {/* Quantity */}
            <div>
              <p className="mb-3 font-semibold">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-xl border bg-white">

                <button
                  onClick={() =>
                    setQuantity(Math.max(1, quantity - 1))
                  }
                  className="px-5 py-3 text-xl hover:bg-gray-100"
                >
                  −
                </button>

                <span className="min-w-[60px] border-x px-5 py-3 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stock, quantity + 1)
                    )
                  }
                  disabled={quantity >= product.stock}
                  className="px-5 py-3 text-xl hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>

              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="mt-7 w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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