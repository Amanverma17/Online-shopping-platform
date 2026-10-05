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
    image?: string;
    image_url?: string;
  };
}

interface Order {
  ID: number;
  total: number;
  status: string;
  CreatedAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/orders")
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Orders error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const cancelOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/orders/${orderId}/cancel`, {
        method: "PUT",
      });

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.ID === orderId
            ? { ...order, status: "cancelled" }
            : order
        )
      );

      alert("Order cancelled successfully");
    } catch (error) {
      console.error("Cancel order error:", error);
      alert("Failed to cancel order");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "placed":
        return "bg-green-50 text-green-700 border-green-200";

      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const totalItems = orders.reduce(
    (total, order) =>
      total +
      order.items.reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0
      ),
    0
  );

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 text-gray-900">

        {/* Main Orders Content */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  My Orders
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  View and track your previous orders
                </p>
              </div>

              <Link
                href="/"
                className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

          {/* Order Summary */}
          {!loading && orders.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">
                  Total Orders
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {orders.length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">
                  Items Ordered
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {totalItems}
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-4 sm:col-span-1">
                <p className="text-xs font-medium text-gray-500">
                  Total Spent
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹
                  {orders
                    .reduce(
                      (total, order) =>
                        total + Number(order.total),
                      0
                    )
                    .toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

              <p className="text-sm text-gray-500">
                Loading your orders...
              </p>

            </div>
          )}

          {/* Empty Orders */}
          {!loading && orders.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl">
                📦
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No orders yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You haven't placed any orders yet. Start shopping
                and your orders will appear here.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700"
              >
                Start Shopping
              </Link>

            </div>
          )}

          {/* Orders */}
          {!loading && orders.length > 0 && (
            <div className="space-y-5">

              {orders.map((order) => {

                const itemCount = order.items.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                );

                return (
                  <div
                    key={order.ID}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >

                    {/* Order Header */}
                    <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <div className="flex items-center gap-3">

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Placed on {formatDate(order.CreatedAt)}
                        </p>

                      </div>

                      <div className="text-left sm:text-right">

                        <p className="text-xs text-gray-500">
                          {itemCount}{" "}
                          {itemCount === 1 ? "item" : "items"}
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          ₹
                          {Number(order.total).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        {(order.status === "placed" ||
                          order.status === "processing") && (
                            <button
                              onClick={() => cancelOrder(order.ID)}
                              className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Cancel Order
                            </button>
                          )}

                      </div>

                    </div>

                    {/* Order Items */}
                    <div className="divide-y divide-gray-100">

                      {order.items?.map((item) => (
                        <div
                          key={item.ID}
                          className="flex items-center gap-4 px-5 py-4"
                        >

                          {/* Product Image */}
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                            {item.product?.image_url || item.product?.image ? (
                              <img
                                src={
                                  item.product.image_url ||
                                  item.product.image
                                }
                                alt={item.product.name}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-2xl">
                                🛍️
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-semibold text-gray-900">
                              {item.product?.name || "Product"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>

                          </div>

                          {/* Price */}
                          <div className="shrink-0 text-right">

                            <p className="text-sm font-bold">
                              ₹
                              {(
                                Number(item.price) *
                                item.quantity
                              ).toLocaleString("en-IN")}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ₹
                              {Number(item.price).toLocaleString(
                                "en-IN"
                              )}{" "}
                              each
                            </p>

                          </div>

                        </div>
                      ))}

                    </div>

                    {/* Order Footer
                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-4">

                      <span className="text-sm font-medium text-gray-600">
                        Order Total
                      </span>

                      <span className="text-lg font-bold">
                        ₹
                        {Number(order.total).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div> */}

                  </div>
                );
              })}

            </div>
          )}

        </section>
      </main>
    </AuthGuard>
  );
}