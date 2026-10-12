"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import AdminGuard from "@/components/AdminGuard";

interface Product {
  ID: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category?: { ID: number; name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setError("");
      const data = await apiFetch("/products");
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) =>
      [p.name, p.category?.name ?? ""].some((v) => v.toLowerCase().includes(query))
    );
  }, [products, search]);

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
      setProducts((current) => current.filter((p) => p.ID !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  return (
    <AdminGuard>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-sm font-black text-white">AB</span>
              <span><span className="block text-base font-bold">ABB Store</span><span className="block text-xs text-slate-500">Administration</span></span>
            </Link>
            <Link href="/" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">View storefront ↗</Link>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
            <nav className="space-y-1">
              <Link href="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">▦ <span>Dashboard</span></Link>
              <Link href="/admin/products" className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">□ <span>Products</span></Link>
              <Link href="/admin/categories" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">▤ <span>Categories</span></Link>
              <Link href="/admin/orders" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">▣ <span>Orders</span></Link>
            </nav>
            <div className="mt-5 border-t border-slate-100 px-3 pt-4">
              <p className="text-xs leading-5 text-slate-500">Manage your catalog and keep product information up to date.</p>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">CATALOG MANAGEMENT</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">Products</h1>
                <p className="mt-2 text-sm text-slate-500">Manage products, prices, and available stock.</p>
              </div>
              <Link href="/admin/products/new" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">＋ Add product</Link>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total products</p><p className="mt-2 text-2xl font-bold">{products.length}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">In stock</p><p className="mt-2 text-2xl font-bold">{products.filter((p) => p.stock > 0).length}</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Out of stock</p><p className="mt-2 text-2xl font-bold">{products.filter((p) => p.stock <= 0).length}</p></div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div><h2 className="font-semibold">Product inventory</h2><p className="mt-1 text-xs text-slate-500">{filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} shown</p></div>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or category..." className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:max-w-xs" />
              </div>

              {loading ? <div className="p-10 text-center text-sm text-slate-500">Loading products…</div> :
                error ? <div className="p-8 text-center"><p className="text-sm text-red-600">{error}</p><button onClick={loadProducts} className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-slate-50">Try again</button></div> :
                filteredProducts.length === 0 ? <div className="p-12 text-center"><p className="font-medium">No products found</p><p className="mt-1 text-sm text-slate-500">Try another search or add a product.</p></div> :
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4 font-semibold">Product</th><th className="px-5 py-4 font-semibold">Category</th><th className="px-5 py-4 font-semibold">Price</th><th className="px-5 py-4 font-semibold">Stock</th><th className="px-5 py-4 text-right font-semibold">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((product) => (
                        <tr key={product.ID} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">{product.image_url ? <img src={product.image_url} alt="" className="h-full w-full object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <span className="text-lg text-slate-300">▧</span>}</div><div className="min-w-0"><p className="max-w-xs truncate font-semibold text-slate-800">{product.name}</p><p className="mt-1 text-xs text-slate-400">ID #{product.ID}</p></div></div></td>
                          <td className="px-5 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{product.category?.name || "Uncategorized"}</span></td>
                          <td className="px-5 py-4 font-semibold">₹{Number(product.price).toLocaleString("en-IN")}</td>
                          <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</span></td>
                          <td className="px-5 py-4"><div className="flex justify-end gap-2"><Link href={`/admin/products/${product.ID}`} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-slate-300 hover:bg-white">Edit</Link><button onClick={() => deleteProduct(product.ID)} className="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}
