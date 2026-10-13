
"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  unit: string;
  today: number;
  category: string;
  change: {
    dir: string;
    pct: number;
  };
};

type Props = {
  products: Product[];
};

function bn(value: number) {
  return value.toLocaleString("bn-BD");
}

export default function CategoryProducts({ products }: Props) {
  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = [...products];

  if (sortBy === "low") {
    sortedProducts.sort((a, b) => a.today - b.today);
  }

  if (sortBy === "high") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <>
      {/* sort dropdown */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#1b2a1f]">
          পণ্য তালিকা
        </h2>


        <div className="flex items-center gap-2">
          <label
            htmlFor="category-sort"
            className="whitespace-nowrap text-sm font-medium text-gray-600"
          >
            সাজান:
          </label>

          <select
            id="category-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-[#e1e9e2] bg-white px-4 py-2 text-sm text-[#1b2a1f] outline-none focus:border-green-600"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low">দাম: কম থেকে বেশি</option>
            <option value="high">দাম: বেশি থেকে কম</option>
          </select>
        </div>

      </div>

      {/* product card */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="rounded-2xl border border-[#e1e9e2] bg-white p-5 transition hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f6f0] text-3xl">
                {product.image || "📦"}
              </div>

              <div>
                <h3 className="font-bold">
                  {product.nameBn}
                </h3>

                <p className="text-sm text-gray-500">
                  প্রতি {product.unit}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500">
                  আজকের দাম
                </p>

                <p className="text-xl font-extrabold">
                  {bn(product.today)} টাকা
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs ${product.change.dir === "up"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
                  }`}
              >
                {product.change.dir === "up" ? "▲" : "▼"}
                {bn(product.change.pct)}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
