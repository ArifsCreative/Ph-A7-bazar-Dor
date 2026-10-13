import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  yesterday: number;
  change: {
    dir: string;
    pct: number;
  };
  markets: Market[];
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

function bn(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 1,
  });
}

function unitBn(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    l: "লিটার",
    dozen: "ডজন",
    pcs: "পিস",
    piece: "পিস",
    g: "গ্রাম",
  };

  return units[unit.toLowerCase()] || unit;
}

async function ProductContent({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }
  const { slug } = await params;

  let product: Product | null = null;

  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/products",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const result = await response.json();

    const products = Array.isArray(result)
      ? result
      : Array.isArray(result.products)
        ? result.products
        : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.products)
            ? result.data.products
            : [];

    product =
      products.find((item: Product) => item.slug === slug) || null;
  } catch (error) {
    console.error("Product fetch error:", error);

    return (
      <p className="rounded-xl bg-red-50 p-5 text-red-600">
        পণ্যের তথ্য লোড করা যায়নি।
      </p>
    );
  }

  if (!product) {
    return (
      <p className="rounded-xl border p-5 text-gray-600">
        পণ্যটি পাওয়া যায়নি।
      </p>
    );
  }

  const markets = product.markets || [];

  const minimum = markets.length
    ? Math.min(...markets.map((m) => m.min))
    : null;

  const maximum = markets.length
    ? Math.max(...markets.map((m) => m.max))
    : null;

  const average = markets.length
    ? markets.reduce(
      (sum, m) => sum + (m.min + m.max) / 2,
      0
    ) / markets.length
    : null;

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <Link href="/" className="hover:text-green-700">
          হোম
        </Link>
        <span>›</span>
        <span>{product.categoryNameBn}</span>
        <span>›</span>
        <span className="font-semibold text-gray-900">
          {product.nameBn}
        </span>
      </div>

      {/* products summary */}
      <section className="rounded-2xl border border-[#e1e9e2] bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f0f6f0] text-4xl">
            {product.image ? (
              <img
                src={product.image}
                alt={product.nameBn}
                className="h-12 w-12 object-contain"
              />
            ) : (
              "📦"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold text-[#1b2a1f] sm:text-3xl">
              {product.nameBn}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              প্রতি {unitBn(product.unit)} · {product.categoryNameBn}
            </p>

            <p className="mt-3 text-sm text-gray-700">
              গতকালের তুলনায় আজ দাম{" "}
              {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "অপরিবর্তিত রয়েছে"}
              {isUp || isDown
                ? ` · ${bn(Math.abs(product.today - product.yesterday))} টাকা`
                : ""}
            </p>
          </div>

          <div className="rounded-xl bg-[#f3f8f3] p-4 text-center sm:min-w-32">
            <p className="text-xs text-gray-500">আজকের দাম</p>

            <p className="mt-1 text-3xl font-extrabold text-gray-900">
              {bn(product.today)}
            </p>

            <p className="text-xs text-gray-600">
              টাকা / {unitBn(product.unit)}
            </p>

            <p
              className={`mt-2 text-xs font-bold ${isUp
                ? "text-red-600"
                : isDown
                  ? "text-green-600"
                  : "text-gray-500"
                }`}
            >
              {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
              {bn(Math.abs(product.change.pct))}%
            </p>
          </div>
        </div>
      </section>

      {/* price summary */}
      <section className="rounded-2xl border border-[#e1e9e2] bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-extrabold text-gray-900">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "সর্বনিম্ন দাম",
              value: minimum,
              color: "text-green-700",
            },
            {
              label: "সর্বোচ্চ দাম",
              value: maximum,
              color: "text-red-600",
            },
            {
              label: "আনুমানিক গড় দাম",
              value: average,
              color: "text-green-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#e1e9e2] bg-[#fafcf9] p-4"
            >
              <p className="text-xs text-gray-500">
                {item.label}
              </p>

              <p className={`mt-2 text-2xl font-extrabold ${item.color}`}>
                {item.value === null
                  ? "—"
                  : `${bn(item.value)} টাকা`}
              </p>
            </div>
          ))}
        </div>

        {/* Market Price */}
        <h2 className="mb-4 mt-8 text-lg font-extrabold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="text-sm text-gray-500">
            কোনো বাজারের তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#e1e9e2]">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                <thead className="bg-[#f7faf7]">
                  <tr className="text-gray-500">
                    <th className="px-4 py-3">বাজার</th>
                    <th className="px-4 py-3">বিভাগ</th>
                    <th className="px-4 py-3 text-right">সর্বনিম্ন</th>
                    <th className="px-4 py-3 text-right">সর্বোচ্চ</th>
                    <th className="px-4 py-3 text-right">গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className={`border-t border-[#e1e9e2] ${index % 2 === 0
                        ? "bg-white"
                        : "bg-[#f0f5f0]"
                        }`}
                    >
                      <td className="px-4 py-3">
                        {market.market}
                      </td>

                      <td className="px-4 py-3">
                        {market.division}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {bn(market.min)} টাকা
                      </td>

                      <td className="px-4 py-3 text-right">
                        {bn(market.max)} টাকা
                      </td>

                      <td className="px-4 py-3 text-right font-bold">
                        {bn((market.min + market.max) / 2)} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-3 text-xs text-gray-500">
          * গড় দাম বাজারের সর্বনিম্ন ও সর্বোচ্চ
          দামের ভিত্তিতে আনুমানিক হিসাব করা হয়েছে।
        </p>
      </section>
    </div>
  );
}

export default function ProductDetailPage({ params }: PageProps) {

  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-screen max-w-[1160px] px-4 py-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="rounded-xl bg-green-50 p-8 text-center">
              পণ্যের তথ্য লোড হচ্ছে...
            </div>
          }
        >
          <ProductContent params={params} />
        </Suspense>
      </main>
    </>
  );
}
