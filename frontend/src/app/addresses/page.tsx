"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";

interface Address {
    ID: number;
    name: string;
    phone: string;
    house: string;
    street: string;
    city: string;
    pincode: string;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        house: "",
        street: "",
        city: "",
        pincode: "",
    });

    const fetchAddresses = async () => {
        try {
            const data = await apiFetch("/addresses");
            setAddresses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Address fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const saveAddress = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !form.name.trim() ||
            !form.phone.trim() ||
            !form.house.trim() ||
            !form.street.trim() ||
            !form.city.trim() ||
            !form.pincode.trim()
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            setSaving(true);

            const addressData = {
                name: form.name.trim(),
                phone: form.phone.trim(),
                house: form.house.trim(),
                street: form.street.trim(),
                city: form.city.trim(),
                pincode: form.pincode.trim(),
            };

            console.log("SENDING ADDRESS TO BACKEND:", addressData);

            await apiFetch("/addresses", {
                method: "POST",
                body: JSON.stringify(addressData),
            });

            alert("Address saved successfully");

            setForm({
                name: "",
                phone: "",
                house: "",
                street: "",
                city: "",
                pincode: "",
            });

            setShowForm(false);

            await fetchAddresses();
        } catch (error) {
            console.error("Save address error:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to save address"
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteAddress = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) {
            return;
        }

        try {
            await apiFetch(`/addresses/${id}`, {
                method: "DELETE",
            });

            setAddresses((current) =>
                current.filter((address) => address.ID !== id)
            );
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete address"
            );
        }
    };

    return (
        <AuthGuard>
            <main className="min-h-screen bg-gray-50 text-gray-900">

                {/* Navbar */}
                {/* <nav className="border-b bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

                        <Link
                            href="/"
                            className="text-2xl font-extrabold"
                        >
                            ABB<span className="text-green-600">Store</span>
                        </Link>

                        <Link
                            href="/account"
                            className="text-sm font-medium text-gray-600 hover:text-green-600"
                        >
                            Back to Account
                        </Link>

                    </div>
                </nav> */}

                <section className="mx-auto max-w-4xl px-4 py-8">

                    <h1 className="text-2xl font-bold">
                        My Addresses
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your delivery addresses
                    </p>

                    {/* Add Button */}
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                        >
                            + Add New Address
                        </button>
                    )}

                    {/* Form */}
                    {showForm && (
                        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center justify-between">

                                <h2 className="text-lg font-bold">
                                    Add New Address
                                </h2>

                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-sm text-gray-500 hover:text-black"
                                >
                                    Cancel
                                </button>

                            </div>

                            <form
                                onSubmit={saveAddress}
                                className="space-y-4"
                            >

                                {/* Name */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Enter your full name"
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                phone: e.target.value,
                                            })
                                        }
                                        placeholder="Enter phone number"
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                                    />
                                </div>

                                {/* House */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        House / Flat / Building
                                    </label>

                                    <input
                                        type="text"
                                        value={form.house}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                house: e.target.value,
                                            })
                                        }
                                        placeholder="Eg: 4/396"
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                                    />
                                </div>

                                {/* Street */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Street / Area
                                    </label>

                                    <input
                                        type="text"
                                        value={form.street}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                street: e.target.value,
                                            })
                                        }
                                        placeholder="Eg: Amman Nagar, Sakthi Nagar"
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        value={form.city}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                city: e.target.value,
                                            })
                                        }
                                        placeholder="Enter city"
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                                    />
                                </div>

                                {/* Pincode */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        value={form.pincode}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                pincode: e.target.value,
                                            })
                                        }
                                        placeholder="Enter pincode"
                                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Address"}
                                </button>

                            </form>

                        </div>
                    )}

                    {/* Saved Addresses */}
                    <div className="mt-8">

                        <h2 className="mb-4 text-lg font-bold">
                            Saved Addresses
                        </h2>

                        {loading ? (

                            <div className="rounded-2xl bg-white p-8 text-center">
                                Loading addresses...
                            </div>

                        ) : addresses.length === 0 ? (

                            <div className="rounded-2xl bg-white p-8 text-center">
                                <div className="text-4xl">📍</div>

                                <h3 className="mt-3 font-semibold">
                                    No saved addresses
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add an address to make checkout faster.
                                </p>
                            </div>

                        ) : (

                            <div className="space-y-4">

                                {addresses.map((address) => (

                                    <div
                                        key={address.ID}
                                        className="rounded-2xl bg-white p-5 shadow-sm"
                                    >

                                        <div className="flex justify-between">

                                            <div>

                                                <h3 className="font-bold">
                                                    {address.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-600">
                                                    {address.phone}
                                                </p>

                                                <p className="mt-3 text-sm text-gray-700">
                                                    {address.house}, {address.street}
                                                </p>

                                                <p className="text-sm text-gray-700">
                                                    {address.city} - {address.pincode}
                                                </p>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    deleteAddress(address.ID)
                                                }
                                                className="text-sm font-medium text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </section>

            </main>
        </AuthGuard>
    );
}