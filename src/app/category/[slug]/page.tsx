import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { connection } from "next/server";
import CategoryProducts from "@/components/CategoryProducts";
import Loading from "./loading";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

type Product = {
    id: number;
    slug: string;
    nameBn: string;
    image: string;
    unit: string;
    today: number;
    category: string;
    categoryNameBn: string;
    categoryIcon: string;
    change: {
        dir: string;
        pct: number;
    };
};


function bn(value: number) {
    return value.toLocaleString("bn-BD");
}


// Dynamic part
async function CategoryContent({
    params,
}: PageProps) {

    await connection();
    const { slug } = await params;

    let products: Product[] = [];


    try {

        const response = await fetch(
            "https://openapi.programming-hero.com/api/bazardor/products",
            {
                cache: "no-store",
            }
        );


        const result = await response.json();


        const allProducts = Array.isArray(result)
            ? result
            : result.products || result.data || [];


        products = allProducts.filter(
            (product: Product) =>
                product.category === slug
        );


    } catch (error) {

        console.log(error);

    }

    const categoryInfo = products[0];

    const categoryName = categoryInfo?.categoryNameBn || slug;
    const categoryIcon = categoryInfo?.categoryIcon || "📦";

    return (

        <>
            {/* Category title */}
            <section className="rounded-2xl border border-[#e1e9e2] bg-white p-6">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f0f6f0] text-3xl">
                        {categoryIcon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#1b2a1f]">
                            {categoryName}
                        </h1>

                        <p className="text-sm text-gray-500">
                            {products.length}টি পণ্যের আজকের দাম ও পরিবর্তন
                        </p>

                    </div>
                </div>

            </section>

            {/* Empty State*/}

            {products.length === 0 ? (
                <div className="mt-8 rounded-xl border p-8 text-center">
                    <h2 className="text-xl font-bold">
                        কোনো পণ্য পাওয়া যায়নি
                    </h2>

                    <Link
                        href="/"
                        className="mt-4 inline-block rounded-lg bg-green-600 px-5 py-2 text-white"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            ) : (
                <CategoryProducts products={products} />
            )}

        </>
    );
}

// Static wrapper
export default function CategoryPage({
    params,
}: PageProps) {

    return (
        <>
            <Navbar />

            <main className="mx-auto min-h-screen max-w-[1160px] px-4 py-8">

                <Suspense fallback={<Loading />}>
                    <CategoryContent params={params} />
                </Suspense>

            </main>
        </>
    );

}