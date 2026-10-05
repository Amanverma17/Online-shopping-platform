"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

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
  category_id: number;
  category: Category;
}

interface CartItem {
  ID: number;
  quantity: number;
  product: {
    ID: number;
    price: number;
  };
}

const categorySubCategories: Record<string, string[]> = {
  Electronics: [
    "All Products",
    "Computers",
    "Keyboards",
    "Mice",
    "Speakers",
    "Accessories",
  ],

  Mobiles: [
    "All Products",
    "Samsung",
    "OnePlus",
    "Apple",
    "Xiaomi",
    "Accessories",
  ],

  Laptops: [
    "All Products",
    "HP",
    "Dell",
    "Lenovo",
    "ASUS",
    "Accessories",
  ],

  Gaming: [
    "All Products",
    "Gaming Consoles",
    "Controllers",
    "Gaming Headsets",
    "Gaming Keyboards",
    "Gaming Mice",
  ],

  Headphones: [
    "All Products",
    "Wireless",
    "Bluetooth",
    "Noise Cancelling",
    "Earbuds",
  ],

  "Smart Watches": [
    "All Products",
    "Apple Watch",
    "Samsung",
    "Noise",
    "Fitness Watches",
  ],

  Cameras: [
    "All Products",
    "DSLR",
    "Mirrorless",
    "Digital Cameras",
    "Camera Accessories",
  ],

  "TV & Entertainment": [
    "All Products",
    "Smart TVs",
    "4K TVs",
    "LED TVs",
    "Speakers",
  ],

  "Computer Accessories": [
    "All Products",
    "Mouse",
    "Keyboard",
    "Webcams",
    "USB Accessories",
  ],

  "Gaming Accessories": [
    "All Products",
    "Gaming Chairs",
    "Mouse Pads",
    "Controllers",
    "Accessories",
  ],

  Fashion: [
    "All Products",
    "Shirts",
    "T-Shirts",
    "Jeans",
    "Jackets",
  ],

  Shoes: [
    "All Products",
    "Running Shoes",
    "Sneakers",
    "Casual Shoes",
    "Sports Shoes",
  ],

  "Beauty & Care": [
    "All Products",
    "Face Care",
    "Body Care",
    "Hair Care",
    "Skin Care",
  ],

  "Home & Kitchen": [
    "All Products",
    "Cookware",
    "Kitchen Appliances",
    "Storage",
    "Home Essentials",
  ],

  Furniture: [
    "All Products",
    "Chairs",
    "Tables",
    "Sofas",
    "Office Furniture",
  ],

  Sports: [
    "All Products",
    "Cricket",
    "Football",
    "Fitness",
    "Outdoor Sports",
  ],

  Groceries: [
    "All Products",
    "Atta",
    "Rice",
    "Dal & Pulses",
    "Cooking Oil",
    "Salt & Sugar",
    "Flours",
    "Organic Products",
  ],

  Books: [
    "All Products",
    "Programming",
    "Fiction",
    "Education",
    "Self Help",
  ],

  "Toys & Games": [
    "All Products",
    "Building Toys",
    "Remote Control",
    "Board Games",
    "Kids Games",
  ],

  Automotive: [
    "All Products",
    "Car Accessories",
    "Bike Accessories",
    "Cleaning",
    "Interior Accessories",
  ],
};

export default function CategoryPage() {
  const params = useParams();

  const categoryName = decodeURIComponent(
    params.category as string
  );

  const subCategories =
    categorySubCategories[categoryName] || ["All Products"];

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [selectedSubCategory, setSelectedSubCategory] =
    useState("All Products");

  const [sortOption, setSortOption] = useState("recommended");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Get all categories
        const categories: Category[] =
          await apiFetch("/categories");

        // Find current category
        const selectedCategory = categories.find(
          (category) =>
            category.name.toLowerCase() ===
            categoryName.toLowerCase()
        );

        if (!selectedCategory) {
          setError("Category not found");
          return;
        }

        // Get products for this category
        const data: Product[] = await apiFetch(
          `/products?category_id=${selectedCategory.ID}`
        );

        setProducts(data);
      } catch (error) {
        console.error("Products error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryName]);

  // =====================================================
  // LOAD CART
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const loadCart = async () => {
      try {
        const data = await apiFetch("/cart");

        setCartItems(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error("Cart error:", error);
      }
    };

    loadCart();
  }, []);

  // =====================================================
  // GET PRODUCT QUANTITY
  // =====================================================

  const getCartQuantity = (productId: number) => {
    const item = cartItems.find(
      (item) => item.product.ID === productId
    );

    return item ? item.quantity : 0;
  };

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const subCategoryKeywords: Record<
    string,
    Record<string, string[]>
  > = {
    Electronics: {
      Computers: ["computer", "desktop", "monitor", "pc"],
      Keyboards: ["keyboard"],
      Mice: ["mouse"],
      Speakers: ["speaker"],
      Accessories: ["usb", "hub", "stand", "accessory", "accessories"],
    },

    Mobiles: {
      Samsung: ["samsung"],
      OnePlus: ["oneplus"],
      Apple: ["apple", "iphone"],
      Xiaomi: ["xiaomi", "redmi"],
      Accessories: ["case", "cover", "charger", "cable", "power bank"],
    },

    Laptops: {
      HP: ["hp"],
      Dell: ["dell"],
      Lenovo: ["lenovo"],
      ASUS: ["asus"],
      Accessories: ["bag", "stand", "charger", "mouse", "keyboard"],
    },

    Gaming: {
      "Gaming Consoles": [
        "playstation",
        "xbox",
        "console",
        "nintendo",
      ],
      Controllers: [
        "controller",
        "gamepad",
      ],
      "Gaming Headsets": [
        "gaming headset",
        "gaming headphones",
      ],
      "Gaming Keyboards": [
        "gaming keyboard",
      ],
      "Gaming Mice": [
        "gaming mouse",
        "gaming mice",
      ],
    },

    Headphones: {
      Wireless: ["wireless"],
      Bluetooth: ["bluetooth"],
      "Noise Cancelling": [
        "noise cancelling",
        "noise cancellation",
      ],
      Earbuds: [
        "earbuds",
        "earbud",
      ],
    },

    "Smart Watches": {
      "Apple Watch": [
        "apple watch",
      ],
      Samsung: [
        "samsung",
      ],
      Noise: [
        "noise",
      ],
      "Fitness Watches": [
        "fitness",
        "fitness watch",
      ],
    },

    Cameras: {
      DSLR: [
        "dslr",
      ],
      Mirrorless: [
        "mirrorless",
      ],
      "Digital Cameras": [
        "digital camera",
      ],
      "Camera Accessories": [
        "camera bag",
        "camera tripod",
        "camera lens",
        "memory card",
        "camera accessory",
      ],
    },

    "TV & Entertainment": {
      "Smart TVs": [
        "smart tv",
      ],
      "4K TVs": [
        "4k",
        "4k tv",
      ],
      "LED TVs": [
        "led tv",
      ],
      Speakers: [
        "speaker",
        "soundbar",
      ],
    },

    "Computer Accessories": {
      Mouse: [
        "mouse",
      ],
      Keyboard: [
        "keyboard",
      ],
      Webcams: [
        "webcam",
        "web camera",
      ],
      "USB Accessories": [
        "usb",
        "hub",
        "adapter",
        "cable",
      ],
    },

    "Gaming Accessories": {
      "Gaming Chairs": [
        "gaming chair",
      ],
      "Mouse Pads": [
        "mouse pad",
        "mouse mat",
      ],
      Controllers: [
        "controller",
        "gamepad",
      ],
      Accessories: [
        "gaming accessory",
        "gaming stand",
        "gaming cable",
      ],
    },

    Fashion: {
      Shirts: [
        "shirt",
      ],
      "T-Shirts": [
        "t-shirt",
        "tshirt",
      ],
      Jeans: [
        "jeans",
      ],
      Jackets: [
        "jacket",
      ],
    },

    Shoes: {
      "Running Shoes": [
        "running",
        "running shoes",
      ],
      Sneakers: [
        "sneaker",
      ],
      "Casual Shoes": [
        "casual",
      ],
      "Sports Shoes": [
        "sports",
        "sports shoes",
      ],
    },

    "Beauty & Care": {
      "Face Care": [
        "face",
        "facial",
      ],
      "Body Care": [
        "body",
      ],
      "Hair Care": [
        "hair",
        "shampoo",
        "conditioner",
      ],
      "Skin Care": [
        "skin",
        "moisturizer",
        "cream",
      ],
    },

    "Home & Kitchen": {
      Cookware: [
        "cookware",
        "pan",
        "pot",
        "kadai",
      ],
      "Kitchen Appliances": [
        "mixer",
        "grinder",
        "microwave",
        "air fryer",
        "blender",
      ],
      Storage: [
        "storage",
        "container",
        "box",
      ],
      "Home Essentials": [
        "home",
        "cleaning",
        "essential",
      ],
    },

    Furniture: {
      Chairs: [
        "chair",
      ],
      Tables: [
        "table",
        "desk",
      ],
      Sofas: [
        "sofa",
        "couch",
      ],
      "Office Furniture": [
        "office chair",
        "office desk",
        "office furniture",
      ],
    },

    Sports: {
      Cricket: [
        "cricket",
        "bat",
        "ball",
        "wicket",
      ],
      Football: [
        "football",
        "soccer",
      ],
      Fitness: [
        "fitness",
        "dumbbell",
        "gym",
        "yoga",
      ],
      "Outdoor Sports": [
        "outdoor",
        "sports",
        "camping",
      ],
    },

    Groceries: {
      Atta: [
        "atta",
        "wheat",
      ],
      Rice: [
        "rice",
      ],
      "Dal & Pulses": [
        "dal",
        "pulse",
        "lentil",
      ],
      "Cooking Oil": [
        "oil",
        "cooking oil",
      ],
      "Salt & Sugar": [
        "salt",
        "sugar",
      ],
      Flours: [
        "flour",
        "maida",
        "besan",
      ],
      "Organic Products": [
        "organic",
      ],
    },

    Books: {
      Programming: [
        "programming",
        "java",
        "python",
        "javascript",
        "coding",
        "software",
      ],
      Fiction: [
        "fiction",
        "novel",
        "story",
      ],
      Education: [
        "education",
        "textbook",
        "academic",
      ],
      "Self Help": [
        "self help",
        "self-help",
        "motivation",
      ],
    },

    "Toys & Games": {
      "Building Toys": [
        "building",
        "lego",
        "blocks",
      ],
      "Remote Control": [
        "remote",
        "rc",
        "remote control",
      ],
      "Board Games": [
        "board game",
        "chess",
        "ludo",
        "monopoly",
      ],
      "Kids Games": [
        "kids",
        "children",
        "toy",
      ],
    },

    Automotive: {
      "Car Accessories": [
        "car",
        "car accessory",
      ],
      "Bike Accessories": [
        "bike",
        "motorcycle",
        "bike accessory",
      ],
      Cleaning: [
        "cleaning",
        "cleaner",
        "polish",
      ],
      "Interior Accessories": [
        "interior",
        "seat cover",
        "dashboard",
      ],
    },
  };

  const filteredProducts =
    selectedSubCategory === "All Products"
      ? products
      : products.filter((product) => {
        const categoryKeywords =
          subCategoryKeywords[categoryName] || {};

        const keywords =
          categoryKeywords[selectedSubCategory] || [];

        const productText =
          `${product.name} ${product.description}`.toLowerCase();

        return keywords.some((keyword) =>
          productText.includes(keyword.toLowerCase())
        );
      });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low") {
      return a.price - b.price;
    }

    if (sortOption === "high") {
      return b.price - a.price;
    }

    return 0;
  });

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (productId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setAdding(productId);

      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      const updatedCart = await apiFetch("/cart");

      setCartItems(
        Array.isArray(updatedCart)
          ? updatedCart
          : []
      );

      // Tell Navbar to refresh cart
      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add product"
      );
    } finally {
      setAdding(null);
    }
  };

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = async (
    productId: number
  ) => {
    const currentQuantity =
      getCartQuantity(productId);

    try {
      await apiFetch(`/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity: currentQuantity + 1,
        }),
      });

      const updatedCart = await apiFetch("/cart");

      setCartItems(
        Array.isArray(updatedCart)
          ? updatedCart
          : []
      );

      // Refresh global Navbar cart
      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error("Quantity error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update quantity"
      );
    }
  };

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = async (
    productId: number
  ) => {
    const currentQuantity =
      getCartQuantity(productId);

    if (currentQuantity <= 1) {
      try {
        await apiFetch(`/cart/${productId}`, {
          method: "DELETE",
        });

        setCartItems((current) =>
          current.filter(
            (item) =>
              item.product.ID !== productId
          )
        );

        // Refresh global Navbar cart
        window.dispatchEvent(
          new Event("cartUpdated")
        );
      } catch (error) {
        console.error(
          "Remove error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to remove product"
        );
      }

      return;
    }

    try {
      await apiFetch(`/cart/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity: currentQuantity - 1,
        }),
      });

      const updatedCart = await apiFetch("/cart");

      setCartItems(
        Array.isArray(updatedCart)
          ? updatedCart
          : []
      );

      // Refresh global Navbar cart
      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Quantity error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update quantity"
      );
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =================================================
          CATEGORY CONTENT
          Navbar is NOT here.
          Navbar comes from layout.tsx
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-5">

        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-500">
          <Link
            href="/"
            className="cursor-pointer hover:text-green-600"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="text-gray-900">
            {categoryName}
          </span>
        </div>

        {/* Category Title */}
        <h1 className="mb-5 text-2xl font-bold">
          {categoryName}
        </h1>

        <div className="flex gap-5">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="hidden w-44 shrink-0 md:block">

            <div className="sticky top-28">

              <h2 className="mb-3 text-sm font-bold">
                Categories
              </h2>

              <div className="space-y-1">

                {subCategories.map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setSelectedSubCategory(item)
                    }
                    className={`w-full rounded-lg px-3 py-3 text-left text-sm transition ${selectedSubCategory === item
                      ? "border-l-4 border-green-600 bg-green-50 font-semibold text-green-700"
                      : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

          </aside>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="flex-1">

            {/* Loading */}
            {loading && (
              <div className="py-20 text-center text-gray-500">
                Loading products...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
                {error}
              </div>
            )}

            {/* No products */}
            {!loading &&
              !error &&
              products.length === 0 && (
                <div className="py-20 text-center text-gray-500">
                  No products available in this category.
                </div>
              )}

            {/* Products */}
            {!loading &&
              !error &&
              products.length > 0 && (
                <>

                  {/* Product toolbar */}
                  <div className="mb-4 flex items-center justify-between">

                    <p className="text-sm text-gray-500">
                      Showing{" "}
                      {filteredProducts.length}{" "}
                      products
                    </p>

                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="rounded-lg border px-3 py-2 text-sm outline-none"
                    >
                      <option value="recommended">
                        Sort by: Recommended
                      </option>

                      <option value="low">
                        Price: Low to High
                      </option>

                      <option value="high">
                        Price: High to Low
                      </option>
                    </select>

                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                    {sortedProducts.map(
                      (product) => {

                        const quantity =
                          getCartQuantity(
                            product.ID
                          );

                        return (
                          <div
                            key={product.ID}
                            className="flex h-full min-h-[355px] flex-col overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
                          >
                            <Link
                              href={`/products/${product.ID}`}
                              className="flex h-full flex-col"
                            >
                              {/* Product Image */}
                              <div className="relative h-[190px] shrink-0 bg-gray-50">
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-gray-400">
                                    No image
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex flex-1 flex-col p-3">

                                {/* Delivery */}
                                <p className="mb-1 h-[18px] text-[11px] text-gray-500">
                                  ⚡ 10 mins
                                </p>

                                {/* Product Name */}
                                <h3 className="line-clamp-2 h-[40px] text-sm font-semibold leading-5">
                                  {product.name}
                                </h3>

                                {/* Description */}
                                <p className="mt-1 line-clamp-2 h-[32px] text-xs leading-4 text-gray-500">
                                  {product.description}
                                </p>

                                {/* Stock */}
                                <p className="mt-1 h-[18px] text-xs text-gray-500">
                                  Stock: {product.stock}
                                </p>

                                {/* Price + Cart */}
                                <div className="mt-auto flex items-center justify-between pt-3">

                                  <span className="font-bold">
                                    ₹{product.price}
                                  </span>

                                  {/* ADD / QUANTITY */}
                                  {quantity === 0 ? (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        addToCart(product.ID);
                                      }}
                                      disabled={adding === product.ID}
                                      className="h-[34px] min-w-[58px] rounded-lg border border-green-600 px-3 text-xs font-bold text-green-600 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {adding === product.ID ? "..." : "ADD"}
                                    </button>
                                  ) : (
                                    <div
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                      className="flex h-[34px] items-center overflow-hidden rounded-lg bg-green-600 text-white"
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          decreaseQuantity(product.ID);
                                        }}
                                        className="px-3 font-bold hover:bg-green-700"
                                      >
                                        −
                                      </button>

                                      <span className="px-2 text-sm font-bold">
                                        {quantity}
                                      </span>

                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          increaseQuantity(product.ID);
                                        }}
                                        className="px-3 font-bold hover:bg-green-700"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>

                              </div>
                            </Link>
                          </div>
                        );
                      }
                    )}

                  </div>

                </>
              )}

          </div>

        </div>

      </section>

    </main>
  );
}