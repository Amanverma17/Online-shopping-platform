"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface CartItem {
  ID: number;
  quantity: number;
  product: {
    ID: number;
    name: string;
    price: number;
  };
}

interface Address {
  ID: number;
  name: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);

  const [showAddresses, setShowAddresses] = useState(false);

  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Load cart and addresses
  useEffect(() => {
    const loadCheckout = async () => {
      try {
        const cartData = await apiFetch("/cart");
        setItems(cartData);

        const addressData = await apiFetch("/addresses");

        console.log("ADDRESS DATA FROM BACKEND:", addressData);

        if (Array.isArray(addressData)) {
          setAddresses(addressData);

          if (addressData.length > 0) {
            setSelectedAddress(
              addressData[addressData.length - 1]
            );
          }
        }
      } catch (error) {
        console.error("Checkout error:", error);

        alert(
          error instanceof Error
            ? error.message
            : "Failed to load checkout"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCheckout();
  }, []);

  // Calculate total
  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  // Select address
  const selectAddress = (address: Address) => {
    setSelectedAddress(address);
    setShowAddresses(false);
  };

  // Delete address
  const deleteAddress = async (addressId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(addressId);

      await apiFetch(`/addresses/${addressId}`, {
        method: "DELETE",
      });

      const updatedAddresses = addresses.filter(
        (address) => address.ID !== addressId
      );

      setAddresses(updatedAddresses);

      if (selectedAddress?.ID === addressId) {
        if (updatedAddresses.length > 0) {
          setSelectedAddress(
            updatedAddresses[updatedAddresses.length - 1]
          );
        } else {
          setSelectedAddress(null);
        }
      }
    } catch (error) {
      console.error("Delete address error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete address"
      );
    } finally {
      setDeleting(null);
    }
  };

  // Place order
  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address first.");
      return;
    }

    try {
      setPlacing(true);

      await apiFetch("/orders", {
        method: "POST",
      });

      alert("Order placed successfully!");

      router.push("/orders");
    } catch (error) {
      console.error("Place order error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to place order"
      );
    } finally {
      setPlacing(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading checkout...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight"
          >
            ABB<span className="text-green-600">Store</span>
          </Link>

          <Link
            href="/cart"
            className="font-medium text-gray-600 hover:text-green-600"
          >
            ← Cart
          </Link>

        </div>
      </nav>

      {/* Checkout */}
      <section className="mx-auto max-w-6xl px-6 py-10">

        <h1 className="text-3xl font-bold">
          Checkout
        </h1>

        {/* Empty Cart */}
        {items.length === 0 ? (

          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              🛒
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some products before checkout.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="mt-8 grid gap-8 lg:grid-cols-3">

            {/* LEFT SIDE */}
            <div className="space-y-5 lg:col-span-2">

              {/* Delivery Address */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <h2 className="text-xl font-bold">
                    Delivery Address
                  </h2>

                  {addresses.length > 0 && (
                    <button
                      onClick={() =>
                        setShowAddresses(!showAddresses)
                      }
                      className="font-semibold text-green-600 hover:text-green-700"
                    >
                      {showAddresses ? "Close" : "Change"}
                    </button>
                  )}

                </div>

                {/* SELECTED ADDRESS */}
                {selectedAddress ? (

                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">

                    <div className="flex gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl">
                        📍
                      </div>

                      <div className="min-w-0">

                        {/* NAME */}
                        <p className="font-bold text-gray-900">
                          {selectedAddress.name}
                        </p>

                        {/* PHONE */}
                        <p className="mt-1 text-sm text-gray-600">
                          📞 {selectedAddress.phone}
                        </p>

                        {/* HOUSE */}
                        <p className="mt-3 text-sm leading-6 text-gray-700">
                          {selectedAddress.house}
                        </p>

                        {/* STREET */}
                        <p className="text-sm leading-6 text-gray-700">
                          {selectedAddress.street}
                        </p>

                        {/* CITY + PINCODE */}
                        <p className="text-sm leading-6 text-gray-700">
                          {selectedAddress.city} -{" "}
                          {selectedAddress.pincode}
                        </p>

                        {/* SELECTED */}
                        <span className="mt-3 inline-block rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                          Selected
                        </span>

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="mt-5 rounded-xl border border-dashed p-6 text-center">

                    <div className="text-4xl">
                      📍
                    </div>

                    <p className="mt-3 text-gray-500">
                      No delivery address found.
                    </p>

                    <Link
                      href="/addresses"
                      className="mt-4 inline-block rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
                    >
                      + Add Address
                    </Link>

                  </div>

                )}

                {/* ADDRESS SELECTOR */}
                {showAddresses && addresses.length > 0 && (

                  <div className="mt-5 border-t pt-5">

                    <div className="mb-4 flex items-center justify-between">

                      <h3 className="font-bold">
                        Select Delivery Address
                      </h3>

                      <span className="text-sm text-gray-500">
                        {addresses.length} saved
                      </span>

                    </div>

                    <div className="space-y-3">

                      {addresses.map((address) => (

                        <div
                          key={address.ID}
                          className={`rounded-xl border p-4 transition ${
                            selectedAddress?.ID === address.ID
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >

                          <div className="flex items-start gap-3">

                            {/* RADIO */}
                            <input
                              type="radio"
                              name="delivery-address"
                              checked={
                                selectedAddress?.ID ===
                                address.ID
                              }
                              onChange={() =>
                                selectAddress(address)
                              }
                              className="mt-1 h-5 w-5 accent-green-600"
                            />

                            <div className="min-w-0 flex-1">

                              {/* NAME */}
                              <p className="font-semibold text-gray-900">
                                {address.name}
                              </p>

                              {/* PHONE */}
                              <p className="mt-1 text-sm text-gray-600">
                                📞 {address.phone}
                              </p>

                              {/* HOUSE */}
                              <p className="mt-2 text-sm text-gray-700">
                                {address.house}
                              </p>

                              {/* STREET */}
                              <p className="text-sm text-gray-700">
                                {address.street}
                              </p>

                              {/* CITY + PINCODE */}
                              <p className="text-sm text-gray-700">
                                {address.city} -{" "}
                                {address.pincode}
                              </p>

                            </div>

                            {/* DELETE */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAddress(address.ID);
                              }}
                              disabled={
                                deleting === address.ID
                              }
                              className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              {deleting === address.ID
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </div>

                      ))}

                    </div>

                    {/* ADD NEW ADDRESS */}
                    <Link
                      href="/addresses"
                      className="mt-4 flex w-full items-center justify-center rounded-xl border border-dashed border-green-500 py-3 font-semibold text-green-600 hover:bg-green-50"
                    >
                      + Add New Address
                    </Link>

                  </div>

                )}

              </div>

              {/* YOUR ITEMS */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">

                <h2 className="mb-5 text-xl font-bold">
                  Your Items
                </h2>

                <div className="space-y-4">

                  {items.map((item) => (

                    <div
                      key={item.ID}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >

                      <div>

                        <h3 className="font-semibold">
                          {item.product.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹{item.product.price} ×{" "}
                          {item.quantity}
                        </p>

                      </div>

                      <p className="font-semibold">
                        ₹
                        {item.product.price *
                          item.quantity}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

            {/* ORDER SUMMARY */}
            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">

                <div className="flex justify-between">

                  <span className="text-gray-600">
                    Items total
                  </span>

                  <span>
                    ₹{total}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-600">
                    Delivery charge
                  </span>

                  <span className="font-medium text-green-600">
                    FREE
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-600">
                    Handling charge
                  </span>

                  <span>
                    ₹2
                  </span>

                </div>

              </div>

              <div className="my-5 border-t" />

              <div className="flex justify-between text-lg font-bold">

                <span>
                  Grand Total
                </span>

                <span>
                  ₹{total + 2}
                </span>

              </div>

              <button
                onClick={placeOrder}
                disabled={placing || !selectedAddress}
                className="mt-6 w-full rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {placing
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              {!selectedAddress && (
                <p className="mt-3 text-center text-xs text-red-500">
                  Please select a delivery address.
                </p>
              )}

            </div>

          </div>

        )}

      </section>

    </main>
  );
}