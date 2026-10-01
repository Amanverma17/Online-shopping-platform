"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Category {
    ID: number;
    name: string;
}

interface Product {
    ID: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    category?: Category;
}

export default function ProductsPage() {
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);

                const endpoint = search
                    ? `/products?search=${encodeURIComponent(search)}`
                    : "/products";

                const data = await apiFetch(endpoint);

                setProducts(
                    Array.isArray(data) ? data : []
                );
            } catch (error) {
                console.error(
                    "Products error:",
                    error
                );

                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [search]);

    return (
        <main className="min-h-screen bg-gray-50 px-8 py-10">

            {/* PAGE TITLE */}

            <div className="mx-auto max-w-7xl">

                <h1 className="text-3xl font-bold text-gray-900">
                    {search
                        ? `Search results for "${search}"`
                        : "All Products"}
                </h1>

                <p className="mt-2 text-gray-500">
                    {loading
                        ? "Searching products..."
                        : `${products.length} product${
                              products.length !== 1
                                  ? "s"
                                  : ""
                          } found`}
                </p>


                {/* LOADING */}

                {loading && (
                    <div className="mt-10 text-center text-gray-500">
                        Loading products...
                    </div>
                )}


                {/* NO RESULTS */}

                {!loading && products.length === 0 && (
                    <div className="mt-16 text-center">

                        <div className="text-5xl">
                            🔍
                        </div>

                        <h2 className="mt-4 text-xl font-semibold text-gray-800">
                            No products found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Try searching for another product.
                        </p>

                        <Link
                            href="/products"
                            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                        >
                            View All Products
                        </Link>

                    </div>
                )}


                {/* PRODUCTS */}

                {!loading && products.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                        {products.map((product) => (

                            <Link
                                key={product.ID}
                                href={`/products/${product.ID}`}
                                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* IMAGE */}

                                <div className="flex h-56 items-center justify-center bg-gray-100 p-5">

                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full w-full object-contain"
                                    />

                                </div>


                                {/* PRODUCT DETAILS */}

                                <div className="p-5">

                                    <p className="text-xs font-medium text-green-600">
                                        {product.category?.name || "Product"}
                                    </p>

                                    <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-gray-900">
                                        {product.name}
                                    </h2>

                                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                        {product.description}
                                    </p>

                                    <p className="mt-4 text-xl font-bold text-gray-900">
                                        ₹{product.price.toLocaleString("en-IN")}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {product.stock > 0
                                            ? `${product.stock} available`
                                            : "Out of stock"}
                                    </p>

                                </div>

                            </Link>

                        ))}

                    </div>
                )}

            </div>

        </main>
    );
}