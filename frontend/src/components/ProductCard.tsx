import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  console.log("PRODUCT:", product);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">

      <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100">
        Product Image
      </div>

      <div className="mt-4">

        <p className="text-sm text-gray-500">
          {product.category?.name}
        </p>

        <h2 className="mt-1 text-lg font-semibold">
          {product.name}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">

          <span className="text-xl font-bold">
            ₹{product.price}
          </span>

          <Link
            href={`/products/${product.ID}`}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            View
          </Link>

        </div>

      </div>
    </div>
  );
}