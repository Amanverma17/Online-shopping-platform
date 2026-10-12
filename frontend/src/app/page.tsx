"use client";

import { useState } from "react";
import Link from "next/link";
// import Navbar from "@/components/Navbar";

const categories = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
  },
  {
    name: "Mobiles",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
  },
  {
    name: "Laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
  },
  {
    name: "Gaming",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80",
  },
  {
    name: "Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  },
  {
    name: "Smart Watches",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  },
  {
    name: "Cameras",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
  },
  {
    name: "TV & Entertainment",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80",
  },
  {
    name: "Computer Accessories",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
  },
  {
    name: "Gaming Accessories",
    image:
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=500&q=80",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
  },
  {
    name: "Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
  },
  {
    name: "Beauty & Care",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
  },
  {
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&q=80",
  },
  {
    name: "Furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
  },
  {
    name: "Groceries",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
  },
  {
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80",
  },
  {
    name: "Toys & Games",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&q=80",
  },
  {
    name: "Automotive",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&q=80",
  },
];

export default function Home() {
  const [categoriesVisible] = useState(true);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =========================
          HERO
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">

        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-green-500 px-5 py-8 text-white sm:px-8 sm:py-12">

          <div className="max-w-xl">

            <p className="mb-2 text-sm font-semibold uppercase tracking-wider">
              E-STORE
            </p>

            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Everything you need,
              <br />
              delivered fast.
            </h1>

            <p className="mt-4 text-base text-green-50 sm:text-lg">
              Shop electronics, mobiles, laptops, groceries,
              fashion and much more.
            </p>

            <Link
              href="#categories"
              className="mt-7 inline-block rounded-lg bg-white px-6 py-3 font-bold text-green-700"
            >
              Explore Categories
            </Link>

          </div>

        </div>

      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      {categoriesVisible && (
        <section
          id="categories"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10"
        >

          <div className="mb-6">

            <h2 className="text-xl font-bold sm:text-2xl">
              Shop by Category
            </h2>

            <p className="mt-1 text-gray-500">
              Explore products from your favorite categories
            </p>

          </div>

          <div className="grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-5 sm:gap-x-4 lg:grid-cols-10">

            {categories.map((category) => (

              <Link
                key={category.name}
                href={`/category/${encodeURIComponent(
                  category.name
                )}`}
                className="group text-center transition hover:-translate-y-1"
              >

                <div className="mx-auto aspect-square w-14 overflow-hidden rounded-xl bg-gray-50 sm:w-16 lg:w-20">

                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                </div>

                <h3 className="mt-2 break-words text-[11px] font-medium leading-tight sm:text-xs lg:text-sm">
                  {category.name}
                </h3>

              </Link>

            ))}

          </div>

        </section>
      )}

      {/* =========================
          WHY SHOP WITH E-STORE
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-16">

        <div className="rounded-2xl bg-gray-50 p-5 sm:p-8">

          <h2 className="text-xl font-bold sm:text-2xl">
            Why shop with E-STORE?
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* Fast Delivery */}
            <div>

              <div className="text-3xl">
                ⚡
              </div>

              <h3 className="mt-2 font-bold">
                Fast Delivery
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Get your products quickly.
              </p>

            </div>

            {/* Secure Payments */}
            <div>

              <div className="text-3xl">
                🔒
              </div>

              <h3 className="mt-2 font-bold">
                Secure Payments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your payments are protected.
              </p>

            </div>

            {/* Quality Products */}
            <div>

              <div className="text-3xl">
                ⭐
              </div>

              <h3 className="mt-2 font-bold">
                Quality Products
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Products you can trust.
              </p>

            </div>

            {/* Easy Returns */}
            <div>

              <div className="text-3xl">
                ↩️
              </div>

              <h3 className="mt-2 font-bold">
                Easy Returns
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Simple and convenient returns.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}