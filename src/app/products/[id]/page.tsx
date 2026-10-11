
import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";

type Product = {
  id: number;
  nameBn: string;
  image: string;
  today: number;
  unit: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

// Product information with server-side fetching
async function ProductInformation({ id }: { id: string }) {
  let product: Product | null = null;

  if (/^\d+$/.test(id)) {
    try {
      const response = await fetch(
        `https://openapi.programming-hero.com/api/bazardor/${id}`,
        {
          cache: "no-store",
        }
      );

      if (response.ok) {
        const result: unknown = await response.json();

        if (result && typeof result === "object") {
          const data = result as Record<string, unknown>;

          const candidate =
            data.product && typeof data.product === "object"
              ? data.product
              : data.data && typeof data.data === "object"
                ? data.data
                : data;

          const p = candidate as Record<string, unknown>;

          if (
            typeof p.id === "number" &&
            typeof p.nameBn === "string" &&
            typeof p.image === "string" &&
            typeof p.today === "number" &&
            typeof p.unit === "string"
          ) {
            product = p as Product;
          }
        }
      }
    } catch (error) {
      console.error("Product details fetch failed:", error);
    }
  }

  if (!product) {
    return (
      <p className="mt-8 text-red-600">
        পণ্যের বিস্তারিত তথ্য পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-green-100 bg-[#fafcf9] p-6 sm:p-10">
      <div className="text-5xl">
        {product.image}
      </div>

      <h1 className="mt-4 text-2xl font-extrabold text-gray-900">
        {product.nameBn}
      </h1>

      <p className="mt-3 text-sm text-gray-500">
        {product.unit}
      </p>

      <p className="mt-5 text-2xl font-bold text-green-700">
        {product.today.toLocaleString("bn-BD")} টাকা
      </p>
    </div>
  );
}


async function ProductContent({
  params,
}: PageProps) {
  const { id } = await params;

  return <ProductInformation id={id} />;
}

export default function ProductDetailPage({
  params,
}: PageProps) {
  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-[60vh] max-w-[1160px] px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/#সব-পণ্য"
          className="text-sm font-semibold text-green-700 hover:underline"
        >
          ← সব পণ্যে ফিরে যান
        </Link>

        <Suspense
          fallback={
            <div
              role="status"
              className="mt-6 rounded-2xl border border-green-100 bg-[#fafcf9] p-8 text-center text-gray-500"
            >
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
