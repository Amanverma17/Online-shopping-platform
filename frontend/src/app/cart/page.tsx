"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";

interface CartProduct {
  ID: number;
  name: string;
  price: number;
  image_url: string;
}

interface CartItem {
  ID: number;
  quantity: number;
  product: CartProduct;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    apiFetch("/cart")
      .then(setItems)
      .catch((error) => {
        console.error("Cart error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Remove item
  const removeItem = async (productId: number) => {
    try {
      await apiFetch(`/cart/${productId}`, {
        method: "DELETE",
      });

      setItems((current) =>
        current.filter(
          (item) => item.product.ID !== productId
        )
      );
    } catch (error) {
      console.error("Remove cart error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove item"
      );
    }
  };

  // Update quantity
  const updateQuantity = async (
    productId: number,
    quantity: number
  ) => {
    try {
      // If quantity becomes 0, remove item
      if (quantity < 1) {
        await removeItem(productId);
        return;
      }

      await apiFetch(`/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity,
        }),
      });

      setItems((current) =>
        current.map((item) =>
          item.product.ID === productId
            ? {
              ...item,
              quantity,
            }
            : item
        )
      );
    } catch (error) {
      console.error("Update quantity error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update quantity"
      );
    }
  };

  // Calculate total
  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  // Loading
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900">
        Loading cart...
      </main>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 text-gray-900">

        {/* ================= HEADER ================= */}

        <nav className="border-b bg-white">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight"
            >
              ABB
              <span className="text-green-600">
                Store
              </span>
            </Link>

            <Link
              href="/"
              className="text-sm font-medium text-gray-600 transition hover:text-green-600"
            >
              Continue Shopping
            </Link>

          </div>

        </nav>

        {/* ================= CART CONTENT ================= */}

        <section className="mx-auto max-w-6xl px-4 py-8">

          {/* Title */}

          <div className="mb-6">

            <h1 className="text-2xl font-bold">
              My Cart
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>

          </div>

          {/* ================= EMPTY CART ================= */}

          {items.length === 0 ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                🛒
              </div>

              <h2 className="mt-4 text-xl font-bold">
                Your cart is empty
              </h2>

              <p className="mt-2 text-gray-500">
                Add some products to continue shopping.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Start Shopping
              </Link>

            </div>

          ) : (

            /* ================= CART WITH ITEMS ================= */

            <div className="grid gap-6 lg:grid-cols-3">

              {/* ================= LEFT SIDE ================= */}

              <div className="space-y-4 lg:col-span-2">

                {/* Delivery Card */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl">
                      ⏱️
                    </div>

                    <div>

                      <h2 className="font-bold">
                        Delivery in 10 minutes
                      </h2>

                      <p className="text-sm text-gray-500">
                        Fast delivery to your location
                      </p>

                    </div>

                  </div>

                </div>

                {/* ================= PRODUCTS ================= */}

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                  <h2 className="mb-5 text-lg font-bold">
                    Your Items
                  </h2>

                  <div className="space-y-5">

                    {items.map((item) => (

                      <div
                        key={item.ID}
                        className="flex items-center gap-4"                      >

                        {/* Product Image */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="min-w-0 flex-1">

                          <h3 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h3>

                          <p className="mt-1 font-semibold text-gray-900">
                            ₹{item.product.price}
                          </p>

                        </div>

                        {/* Quantity */}
                        <div className="shrink-0">

                          <div className="flex items-center overflow-hidden rounded-lg bg-green-600 text-white">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.ID,
                                  item.quantity - 1
                                )
                              }
                              className="px-3 py-2 text-lg font-bold hover:bg-green-700"
                            >
                              −
                            </button>

                            <span className="min-w-[35px] text-center font-bold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.ID,
                                  item.quantity + 1
                                )
                              }
                              className="px-3 py-2 text-lg font-bold hover:bg-green-700"
                            >
                              +
                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

              {/* ================= BILL DETAILS ================= */}

              <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

                <h2 className="text-lg font-bold">
                  Bill Details
                </h2>

                <div className="mt-5 space-y-4 text-sm">

                  {/* Items Total */}

                  <div className="flex justify-between">

                    <span className="text-gray-600">
                      Items total
                    </span>

                    <span className="font-medium">
                      ₹{total}
                    </span>

                  </div>

                  {/* Delivery */}

                  <div className="flex justify-between">

                    <span className="text-gray-600">
                      Delivery charge
                    </span>

                    <span className="font-medium text-green-600">
                      FREE
                    </span>

                  </div>

                  {/* Handling */}

                  <div className="flex justify-between">

                    <span className="text-gray-600">
                      Handling charge
                    </span>

                    <span className="font-medium">
                      ₹2
                    </span>

                  </div>

                </div>

                {/* Divider */}

                <div className="my-5 border-t" />

                {/* Grand Total */}

                <div className="flex justify-between text-lg font-bold">

                  <span>
                    Grand Total
                  </span>

                  <span>
                    ₹{total + 2}
                  </span>

                </div>

                {/* Checkout */}

                <Link
                  href="/checkout"
                  className="mt-6 block w-full rounded-lg bg-green-600 py-3 text-center font-bold text-white transition hover:bg-green-700"
                >
                  Proceed to Checkout →
                </Link>

              </div>

            </div>

          )}

        </section>

      </main>
    </AuthGuard>
  );
}