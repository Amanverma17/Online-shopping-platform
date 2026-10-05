"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";


interface Address {
    ID: number;
    name: string;
    phone: string;
    house: string;
    street: string;
    city: string;
    pincode: string;
}

interface CartItem {
    ID: number;
    quantity: number;
    product: {
        ID: number;
        price: number;
    };
}

interface UserProfile {
    phone?: string;
    phone_number?: string;
}

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] =
        useState<Address | null>(null);


    const [addressOpen, setAddressOpen] = useState(false);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const [accountOpen, setAccountOpen] = useState(false);

    const [phoneNumber, setPhoneNumber] =
        useState("Account");

    // =========================
    // LOAD USER DATA
    // =========================

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");

            setIsLoggedIn(!!token);

            if (!token) {
                setPhoneNumber("Account");
                setAddresses([]);
                setSelectedAddress(null);
                setCartItems([]);
                return;
            }

            // Load profile
            apiFetch("/profile")
                .then((data: UserProfile) => {
                    const phone =
                        data?.phone ||
                        data?.phone_number;

                    if (phone) {
                        setPhoneNumber(phone);
                    }
                })
                .catch((error) => {
                    console.error("Profile error:", error);
                });

            // Load addresses
            apiFetch("/addresses")
                .then((data) => {
                    const list = Array.isArray(data)
                        ? data
                        : [];

                    setAddresses(list);

                    const savedAddressId =
                        localStorage.getItem("selectedAddressId");

                    if (savedAddressId) {
                        const saved = list.find(
                            (address: Address) =>
                                address.ID ===
                                Number(savedAddressId)
                        );

                        if (saved) {
                            setSelectedAddress(saved);
                            return;
                        }
                    }

                    if (list.length > 0) {
                        setSelectedAddress(list[0]);

                        localStorage.setItem(
                            "selectedAddressId",
                            String(list[0].ID)
                        );
                    }
                })
                .catch((error) => {
                    console.error("Address error:", error);
                });

            loadCart();
        };

        checkAuth();

        window.addEventListener("authUpdated", checkAuth);
        window.addEventListener("storage", checkAuth);
        window.addEventListener("focus", checkAuth);

        return () => {
            window.removeEventListener("authUpdated", checkAuth);
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("focus", checkAuth);
        };
    }, [pathname]);

    // =========================
    // LOAD CART
    // =========================

    const loadCart = async () => {
        try {
            const data =
                await apiFetch("/cart");

            setCartItems(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                "Cart error:",
                error
            );
        }
    };

    // =========================
    // ADDRESS UPDATE LISTENER
    // =========================

    useEffect(() => {
        const updateAddress = () => {
            const savedAddressId =
                localStorage.getItem(
                    "selectedAddressId"
                );

            if (!savedAddressId) return;

            const address =
                addresses.find(
                    (item) =>
                        item.ID ===
                        Number(
                            savedAddressId
                        )
                );

            if (address) {
                setSelectedAddress(
                    address
                );
            }
        };

        window.addEventListener(
            "addressUpdated",
            updateAddress
        );

        return () => {
            window.removeEventListener(
                "addressUpdated",
                updateAddress
            );
        };
    }, [addresses]);

    // =========================
    // CART UPDATE LISTENER
    // =========================

    useEffect(() => {
        const refreshCart = () => {
            loadCart();
        };

        window.addEventListener(
            "cartUpdated",
            refreshCart
        );

        return () => {
            window.removeEventListener(
                "cartUpdated",
                refreshCart
            );
        };
    }, []);

    // =========================
    // SELECT ADDRESS
    // =========================

    const selectAddress = (
        address: Address
    ) => {
        setSelectedAddress(address);

        localStorage.setItem(
            "selectedAddressId",
            String(address.ID)
        );

        setAddressOpen(false);

        window.dispatchEvent(
            new Event("addressUpdated")
        );
    };

    // =========================
    // CART CALCULATION
    // =========================

    const cartQuantity =
        cartItems.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    const cartTotal =
        cartItems.reduce(
            (total, item) =>
                total +
                item.product.price *
                item.quantity,
            0
        );

    // =========================
    // LOGOUT
    // =========================

    const logout = () => {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "selectedAddressId"
        );

        setIsLoggedIn(false);
        setAccountOpen(false);
        setSelectedAddress(null);
        setAddresses([]);
        setCartItems([]);

        window.dispatchEvent(
            new Event("authUpdated")
        );

        window.location.href = "/";
    };

    // =========================
    // SHORT ADDRESS
    // =========================

    const addressText =
        selectedAddress
            ? `${selectedAddress.house}, ${selectedAddress.street}, ${selectedAddress.city} - ${selectedAddress.pincode}`
            : "Select delivery address";

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const query = searchQuery.trim();

        if (!query) return;

        router.push(`/products?search=${encodeURIComponent(query)}`);
    };

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <nav className="w-full border-b border-gray-200 bg-white">
            <div className="flex h-[86px] w-full items-center px-8">

                {/* ===================== */}
                {/* LOGO */}
                {/* ===================== */}

                <Link
                    href="/"
                    className="mr-8 shrink-0 text-3xl font-extrabold tracking-tight"
                >
                    ABB
                    <span className="text-green-600">
                        Store
                    </span>
                </Link>

                {/* ===================== */}
                {/* DELIVERY ADDRESS */}
                {/* ===================== */}

                <div className="relative mr-8 w-[230px] shrink-0">

                    <button
                        onClick={() =>
                            setAddressOpen(
                                !addressOpen
                            )
                        }
                        className="block w-full text-left"
                    >
                        <div className="flex items-center gap-1">
                            <p className="whitespace-nowrap text-base font-bold">
                                Delivery in 10 minutes
                            </p>
                        </div>

                        <div className="mt-0.5 flex items-center gap-2">

                            <p className="min-w-0 flex-1 truncate text-sm text-gray-500">
                                {addressText}
                            </p>

                            <span className="shrink-0 text-[11px] text-gray-700">
                                ▼
                            </span>

                        </div>
                    </button>

                    {/* ===================== */}
                    {/* ADDRESS DROPDOWN */}
                    {/* ===================== */}

                    {addressOpen && (
                        <div className="absolute left-0 top-[62px] z-50 w-[360px] overflow-hidden rounded-xl bg-white shadow-2xl">

                            <div className="px-4 py-3">
                                <p className="text-base font-bold">
                                    Select delivery address
                                </p>

                                <p className="mt-0.5 text-xs text-gray-500">
                                    Choose where you want your order delivered
                                </p>
                            </div>

                            {addresses.length === 0 ? (

                                <div className="px-4 py-4">

                                    <p className="text-sm text-gray-500">
                                        No saved addresses
                                    </p>

                                    <Link
                                        href="/addresses"
                                        onClick={() =>
                                            setAddressOpen(
                                                false
                                            )
                                        }
                                        className="mt-3 inline-block text-sm font-semibold text-green-600"
                                    >
                                        + Add an address
                                    </Link>

                                </div>

                            ) : (

                                <div className="max-h-[300px] overflow-y-auto">

                                    {addresses.map(
                                        (address) => {

                                            const isSelected =
                                                selectedAddress?.ID ===
                                                address.ID;

                                            return (
                                                <button
                                                    key={
                                                        address.ID
                                                    }
                                                    onClick={() =>
                                                        selectAddress(
                                                            address
                                                        )
                                                    }
                                                    className={`w-full px-4 py-4 text-left hover:bg-gray-50 ${isSelected
                                                        ? "bg-green-50"
                                                        : ""
                                                        }`}
                                                >

                                                    <div className="flex gap-3">

                                                        <span className="mt-1 shrink-0 text-lg">
                                                            📍
                                                        </span>

                                                        <div className="min-w-0 flex-1">

                                                            <div className="flex items-center justify-between gap-2">

                                                                <p className="truncate font-semibold text-gray-900">
                                                                    {
                                                                        address.name
                                                                    }
                                                                </p>

                                                                {isSelected && (
                                                                    <span className="shrink-0 text-xs font-bold text-green-600">
                                                                        ✓ Selected
                                                                    </span>
                                                                )}

                                                            </div>

                                                            <p className="mt-1 break-words text-sm leading-5 text-gray-600">
                                                                {
                                                                    address.house
                                                                }
                                                                ,{" "}
                                                                {
                                                                    address.street
                                                                }
                                                            </p>

                                                            <p className="break-words text-sm leading-5 text-gray-600">
                                                                {
                                                                    address.city
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    address.pincode
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                            <div className="p-3">

                                <Link
                                    href="/addresses"
                                    onClick={() =>
                                        setAddressOpen(
                                            false
                                        )
                                    }
                                    className="block rounded-lg border border-green-600 py-2.5 text-center text-sm font-semibold text-green-600 hover:bg-green-50"
                                >
                                    Manage Addresses
                                </Link>

                            </div>

                        </div>
                    )}

                </div>

                {/* ===================== */}
                {/* SEARCH */}
                {/* ===================== */}

                <form
                    onSubmit={handleSearch}
                    className="flex min-w-0 flex-1 items-center rounded-xl border border-gray-300 px-5 py-3"
                >
                    <span className="mr-3 shrink-0 text-xl text-gray-700">
                        ⌕
                    </span>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="min-w-0 flex-1 bg-transparent text-base outline-none"
                    />
                </form>

                {/* ===================== */}
                {/* ACCOUNT */}
                {/* ===================== */}

                <div className="ml-8 shrink-0">

                    {isLoggedIn ? (

                        <div className="relative">

                            {/* ACCOUNT BUTTON */}

                            <button
                                onClick={() =>
                                    setAccountOpen(
                                        !accountOpen
                                    )
                                }
                                className="flex items-center gap-2 px-2 py-2 text-lg font-medium"
                            >

                                <span className="text-purple-700">
                                    👤
                                </span>

                                <span>
                                    Account
                                </span>

                                <span className="text-xs">
                                    {accountOpen
                                        ? "▲"
                                        : "▼"}
                                </span>

                            </button>

                            {/* ACCOUNT DROPDOWN */}

                            {accountOpen && (

                                <div className="absolute right-0 top-full z-[100] mt-2 w-[300px] overflow-hidden rounded-xl bg-white shadow-2xl">

                                    {/* PHONE NUMBER */}

                                    <div className="px-5 py-5">

                                        <p className="text-lg font-bold text-gray-900">
                                            {phoneNumber}
                                        </p>

                                    </div>

                                    <div className="border-t border-gray-100" />

                                    {/* MY ORDERS */}

                                    <Link
                                        href="/orders"
                                        onClick={() =>
                                            setAccountOpen(
                                                false
                                            )
                                        }
                                        className="flex items-center gap-4 px-5 py-4 text-gray-700 hover:bg-gray-50"
                                    >

                                        <span className="text-xl">
                                            📦
                                        </span>

                                        <span className="text-base">
                                            My Orders
                                        </span>

                                    </Link>

                                    {/* SAVED ADDRESSES */}

                                    <Link
                                        href="/addresses"
                                        onClick={() =>
                                            setAccountOpen(
                                                false
                                            )
                                        }
                                        className="flex items-center gap-4 px-5 py-4 text-gray-700 hover:bg-gray-50"
                                    >

                                        <span className="text-xl">
                                            📍
                                        </span>

                                        <span className="text-base">
                                            Saved Addresses
                                        </span>

                                    </Link>

                                    <div className="border-t border-gray-100" />

                                    {/* LOGOUT */}

                                    <button
                                        onClick={
                                            logout
                                        }
                                        className="flex w-full items-center gap-4 px-5 py-4 text-left text-red-600 hover:bg-red-50"
                                    >

                                        <span className="text-xl">
                                            🚪
                                        </span>

                                        <span className="text-base font-medium">
                                            Logout
                                        </span>

                                    </button>

                                </div>
                            )}

                        </div>

                    ) : (

                        <Link
                            href="/login"
                            className="hidden text-lg font-medium md:block"
                        >
                            Login
                        </Link>

                    )}

                </div>

                {/* ===================== */}
                {/* CART */}
                {/* ===================== */}

                <Link
                    href="/cart"
                    className="ml-8 flex shrink-0 items-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >

                    🛒

                    <span className="ml-2 whitespace-nowrap">
                        {cartQuantity > 0
                            ? `${cartQuantity} items`
                            : "Cart"}
                    </span>

                    {cartQuantity > 0 && (
                        <span className="ml-2 whitespace-nowrap">
                            ₹{cartTotal}
                        </span>
                    )}

                </Link>


            </div>


        </nav>
    );
}