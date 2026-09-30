"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";

interface OrderItem {
  ID: number;
  quantity: number;
  price: number;
  product: {
    ID: number;
    name: string;
  };
}

interface Order {
  ID: number;
  user_id: number;
  total: number;
  status: string;
  CreatedAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/orders")
      .then(setOrders)
      .catch((error) => {
        console.error("Orders error:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard adminOnly>
      <main className="min-h-screen bg-gray-50 text-gray-900">

        {/* Navbar */}
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

        {/* Content */}
        <section className="mx-auto max-w-7xl px-6 py-10">

          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Manage customer orders
          </p>

          {loading ? (

            <p className="mt-10 text-gray-500">
              Loading orders...
            </p>

          ) : orders.length === 0 ? (

            <div className="mt-10 rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">
                No orders found.
              </p>
            </div>

          ) : (

            <div className="mt-8 space-y-6">

              {orders.map((order) => (

                <div
                  key={order.ID}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >

                  {/* Header */}
                  <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row">

                    <div>

                      <h2 className="text-lg font-bold">
                        Order #{order.ID}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Customer ID: {order.user_id}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          order.CreatedAt
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    <div className="md:text-right">

                      <p className="text-xl font-bold">
                        ₹{order.total}
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        {order.status}
                      </span>

                    </div>

                  </div>

                  {/* Items */}
                  <div className="mt-5 space-y-3">

                    {order.items?.map((item) => (

                      <div
                        key={item.ID}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                      >

                        <div>

                          <p className="font-medium">
                            {item.product?.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>

                        </div>

                        <p className="font-semibold">
                          ₹{item.price * item.quantity}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>
    </AuthGuard>
  );
}