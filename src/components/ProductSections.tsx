
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat" | "same";
    pct: number;
  };
};

function bn(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });
}

function unitName(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    g: "প্রতি গ্রাম",
    litre: "প্রতি লিটার",
    liter: "প্রতি লিটার",
    l: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    pcs: "প্রতি পিস",
    piece: "প্রতি পিস",
    packet: "প্রতি প্যাকেট",
  };

  return units[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

function PriceChange({ product }: { product: Product }) {
  const { dir, pct } = product.change;

  const isUp = dir === "up" && pct !== 0;
  const isDown = dir === "down" && pct !== 0;

  const color = isUp
    ? "bg-green-50 text-green-700"
    : isDown
      ? "bg-red-50 text-red-600"
      : "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${color}`}
    >
      <span aria-hidden="true">
        {isUp ? "▲" : isDown ? "▼" : "—"}
      </span>
      {bn(Math.abs(pct))}%
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block min-w-0 rounded-xl border border-[#e3ebe4] bg-[#fafcf9] p-4 text-gray-900 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
      aria-label={`${product.nameBn} - বিস্তারিত দেখুন`}
    >
      <div className="flex items-start gap-3">
        {/* PRODUCT EMOJI */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5ee] text-2xl">
          <span role="img" aria-label={product.nameBn}>
            {product.image || "📦"}
          </span>
        </div>

        {/* PRODUCT NAME */}
        <div className="min-w-0 flex-1">
          <h3 className="wrap-break-word text-[14px] leading-6 font-bold text-[#1d2b20] group-hover:text-green-700">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 text-[11px] text-gray-500">
            {unitName(product.unit)}
          </p>
        </div>
      </div>

      {/* PRICE INFORMATION */}
      <div className="mt-5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-gray-500">
            আজকের দাম
          </p>

          <p className="mt-1 text-[17px] leading-6 font-extrabold text-[#1b2a1f]">
            {bn(product.today)} টাকা
          </p>
        </div>

        <PriceChange product={product} />
      </div>
    </Link>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Product API request failed");
        }

        const result: unknown = await response.json();

        let items: unknown = result;

        if (
          result !== null &&
          typeof result === "object" &&
          !Array.isArray(result)
        ) {
          const wrapper = result as Record<string, unknown>;

          items = wrapper.products ?? wrapper.data;
        }

        if (!Array.isArray(items)) {
          throw new Error("Invalid API response format");
        }

        const validProducts = items.filter(
          (item): item is Product => {
            if (!item || typeof item !== "object") {
              return false;
            }

            const p = item as Record<string, unknown>;

            if (!p.change || typeof p.change !== "object") {
              return false;
            }

            const change = p.change as Record<string, unknown>;

            return (
              typeof p.id === "number" &&
              typeof p.nameBn === "string" &&
              typeof p.today === "number" &&
              typeof p.unit === "string" &&
              typeof p.image === "string" &&
              typeof change.dir === "string" &&
              typeof change.pct === "number"
            );
          }
        );

        if (validProducts.length === 0) {
          throw new Error("No products found");
        }

        if (!controller.signal.aborted) {
          setProducts(validProducts);
          setError("");
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error(err);
        setError("পণ্যের তথ্য লোড করা যায়নি।");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  // SIX PRODUCTS WITH THE LARGEST PRICE INCREASES
  const topRisers = products
    .filter(
      (p) => p.change.dir === "up" && p.change.pct !== 0
    )
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  // SIX PRODUCTS WITH THE LARGEST PRICE DECREASES
  const topFallers = products
    .filter(
      (p) => p.change.dir === "down" && p.change.pct !== 0
    )
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) - Math.abs(a.change.pct)
    )
    .slice(0, 6);

  if (loading) {
    return (
      <section className="mx-auto max-w-[1160px] px-4 py-12 sm:px-6 lg:px-8">
        <p role="status" className="text-center text-gray-500">
          পণ্যের তথ্য লোড হচ্ছে...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-[1160px] px-4 py-12 sm:px-6 lg:px-8">
        <p role="alert" className="text-center text-red-600">
          {error}
        </p>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1160px] space-y-10 px-4 py-10 sm:space-y-12 sm:px-6 lg:px-8">

      {/* SECTION A: PRICE INCREASE */}
      <section aria-labelledby="risers-heading">
        <h2
          id="risers-heading"
          className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#1b2a1f]"
        >
          <span className="text-red-500">▲</span>
          আজ দাম বেড়েছে
        </h2>

        <ProductGrid products={topRisers} />
      </section>

      {/* SECTION B: PRICE DECREASE */}
      <section aria-labelledby="fallers-heading">
        <h2
          id="fallers-heading"
          className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#1b2a1f]"
        >
          <span className="text-green-600">▼</span>
          আজ দাম কমেছে
        </h2>

        <ProductGrid products={topFallers} />
      </section>

      {/* SECTION C: ALL PRODUCTS */}
      <section
        id="সব-পণ্য"
        aria-labelledby="products-heading"
        className="scroll-mt-6"
      >
        <div className="mb-5">
          <h2
            id="products-heading"
            className="text-xl font-extrabold text-[#1b2a1f]"
          >
            সব পণ্য
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            মোট {bn(products.length)}টি পণ্যের দাম
          </p>
        </div>

        <ProductGrid products={products} />
      </section>
    </div>
  );
}
