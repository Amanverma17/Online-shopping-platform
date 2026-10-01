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

  // 0 means product is NOT in cart
  const [quantity, setQuantity] = useState(0);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  // =========================================================
  // LOAD PRODUCT
  // =========================================================

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const data = await apiFetch(`/products/${id}`);

        setProduct(data);
      } catch (error) {
        console.error("Product error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // =========================================================
  // LOAD EXISTING CART QUANTITY
  // =========================================================

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const loadCartQuantity = async () => {
      try {
        const cart = await apiFetch("/cart");

        const items = Array.isArray(cart)
          ? cart
          : cart?.items || [];

        const existingItem = items.find(
          (item: any) =>
            Number(item.product_id) === Number(id) ||
            Number(item.product?.ID) === Number(id) ||
            Number(item.product?.id) === Number(id)
        );

        if (existingItem) {
          setQuantity(
            Number(existingItem.quantity) || 1
          );
        } else {
          // Product is not in cart
          setQuantity(0);
        }
      } catch (error) {
        console.error(
          "Cart quantity could not be loaded:",
          error
        );

        setQuantity(0);
      }
    };

    loadCartQuantity();
  }, [id]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      router.push("/login");
      return;
    }

    if (!product || product.stock <= 0) {
      return;
    }

    try {
      setAdding(true);

      // IMPORTANT:
      // Product is not in cart yet.
      // Therefore use POST /cart.
      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          product_id: product.ID,
          quantity: 1,
        }),
      });

      // Change UI from ADD to - 1 +
      setQuantity(1);

      // Tell Navbar to refresh cart
      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add product to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = async () => {
    if (!product) return;

    // Product must already be in cart
    if (quantity <= 0) return;

    // Don't exceed stock
    if (quantity >= product.stock) {
      return;
    }

    const oldQuantity = quantity;
    const newQuantity = quantity + 1;

    try {
      setUpdating(true);

      // Update UI immediately
      setQuantity(newQuantity);

      // Product already exists in cart
      await apiFetch(`/cart/${product.ID}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      // Refresh Navbar
      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );

      // Restore previous quantity
      setQuantity(oldQuantity);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to increase quantity"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  const decreaseQuantity = async () => {
    if (!product) return;

    // Nothing in cart
    if (quantity <= 0) {
      return;
    }

    // =====================================================
    // QUANTITY = 1
    // Remove the product completely
    // =====================================================

    if (quantity === 1) {
      try {
        setUpdating(true);

        await apiFetch(`/cart/${product.ID}`, {
          method: "DELETE",
        });

        // Change UI back to ADD
        setQuantity(0);

        // Refresh Navbar
        window.dispatchEvent(
          new Event("cartUpdated")
        );
      } catch (error) {
        console.error(
          "Remove product error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to remove product"
        );
      } finally {
        setUpdating(false);
      }

      return;
    }

    // =====================================================
    // QUANTITY > 1
    // Decrease normally
    // =====================================================

    const oldQuantity = quantity;
    const newQuantity = quantity - 1;

    try {
      setUpdating(true);

      // Update UI immediately
      setQuantity(newQuantity);

      await apiFetch(`/cart/${product.ID}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      // Refresh Navbar
      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );

      // Restore previous quantity
      setQuantity(oldQuantity);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to decrease quantity"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">
          Loading product...
        </p>
      </main>
    );
  }

  // =========================================================
  // PRODUCT NOT FOUND
  // =========================================================

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

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}


      {/* =====================================================
          PRODUCT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-8">

        {/* Back */}

        <Link
          href="/"
          className="text-sm font-medium text-gray-500 transition hover:text-green-600"
        >
          ← Back to products
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-2">

          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="flex h-[550px] items-center justify-center overflow-hidden rounded-2xl border bg-white p-8">

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-gray-400">
                Product Image
              </div>
            )}

          </div>

          {/* =================================================
              DETAILS
          ================================================= */}

          <div className="flex flex-col justify-center">

            {/* Category */}

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {product.category?.name}
            </p>

            {/* Product Name */}

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

            {/* =================================================
                CART CONTROL
            ================================================= */}

            {quantity === 0 ? (

              /* =================================================
                 ADD TO CART
              ================================================= */

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  adding ||
                  product.stock === 0
                }
                className="w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : adding
                    ? "Adding..."
                    : "Add to Cart"}
              </button>

            ) : (

              /* =================================================
                 QUANTITY CONTROLS
              ================================================= */

              <div>

                <p className="mb-3 font-semibold">
                  Quantity
                </p>

                <div className="flex w-fit items-center overflow-hidden rounded-xl border border-green-600 bg-green-600 text-white">

                  {/* MINUS */}

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={updating}
                    className="flex h-14 w-16 items-center justify-center text-2xl font-bold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    −
                  </button>

                  {/* QUANTITY */}

                  <span className="flex h-14 min-w-[70px] items-center justify-center border-x border-green-500 px-5 text-lg font-bold">
                    {quantity}
                  </span>

                  {/* PLUS */}

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      updating ||
                      quantity >= product.stock
                    }
                    className="flex h-14 w-16 items-center justify-center text-2xl font-bold transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    +
                  </button>

                </div>

                {/* Maximum stock message */}

                {quantity >= product.stock &&
                  product.stock > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      Maximum available quantity reached.
                    </p>
                  )}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}