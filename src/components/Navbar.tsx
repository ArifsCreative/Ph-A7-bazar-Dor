"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
    ShoppingCart,
} from "lucide-react";

type Category = {
    id: string;
    name: string;
    icon: string;
};

const tickerProducts = [
    {
        id: 1,
        emoji: "🍚",
        name: "স্বর্ণমাছি চাল",
        price: 148,
        unit: "কেজি",
        change: 2.1,
    },
    {
        id: 2,
        emoji: "🍚",
        name: "মিনিকেট চাল",
        price: 99,
        unit: "কেজি",
        change: -2.9,
    },
    {
        id: 3,
        emoji: "🥔",
        name: "আলু",
        price: 30,
        unit: "কেজি",
        change: -3.2,
    },
    {
        id: 4,
        emoji: "🧅",
        name: "পেঁয়াজ",
        price: 54,
        unit: "কেজি",
        change: 2.5,
    },
];

const bn = (value: number) =>
    value.toLocaleString("bn-BD", {
        maximumFractionDigits: 1,
    });

export default function Navbar() {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            const result = await authClient.signOut();

            if (result.error) {
                toast.error(result.error.message || "Logout failed");
                return;
            }

            toast.success("Logged out successfully!");

            router.push("/");
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoggingOut(false);
        }
    }

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [banglaDate, setBanglaDate] = useState("বাংলা তারিখ");
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const updateDate = () => {
            try {
                const formatter = new Intl.DateTimeFormat(
                    "bn-BD-u-ca-beng",
                    {
                        timeZone: "Asia/Dhaka",
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }
                );

                setBanglaDate(formatter.format(new Date()));
            } catch {
                setBanglaDate(
                    new Intl.DateTimeFormat("bn-BD", {
                        timeZone: "Asia/Dhaka",
                        dateStyle: "long",
                    }).format(new Date())
                );
            }
        };

        updateDate();

        const interval = window.setInterval(updateDate, 60_000);

        return () => window.clearInterval(interval);
    }, []);


    useEffect(() => {
        const controller = new AbortController();

        async function fetchCategories() {
            try {
                const response = await fetch(
                    "/api/products",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }

                const result = await response.json();

                const products = Array.isArray(result)
                    ? result
                    : result.products ?? result.data;

                if (!Array.isArray(products)) {
                    throw new Error("Invalid API response");
                }

                const uniqueCategories = new Map<string, Category>();

                products.forEach((product) => {
                    if (
                        typeof product.category === "string" &&
                        typeof product.categoryNameBn === "string"
                    ) {
                        if (!uniqueCategories.has(product.category)) {
                            uniqueCategories.set(product.category, {
                                id: product.category,
                                name: product.categoryNameBn,
                                icon: product.categoryIcon || "📦",
                            });
                        }
                    }
                });

                if (!controller.signal.aborted) {
                    setCategories([...uniqueCategories.values()]);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Category API error:", error);
                }
            }
        }

        fetchCategories();

        return () => controller.abort();
    }, []);


    const renderTickerItems = () =>
        tickerProducts.map((item) => (
            <div
                key={item.id}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[12px]"
            >
                <span>{item.emoji}</span>
                <span className="font-medium">{item.name}</span>

                <span className="font-semibold">
                    ৳{bn(item.price)}/{item.unit}
                </span>

                <span
                    className={
                        item.change > 0
                            ? "font-bold text-red-600"
                            : "font-bold text-green-600"
                    }
                >
                    {item.change > 0 ? "▲" : "▼"}
                    {bn(Math.abs(item.change))}%
                </span>
            </div>
        ));

    return (
        <>
            <Toaster position="top-right" richColors />

            <header className="w-full bg-white text-gray-900">

                {/*Headerr */}

                <div className="border-b border-gray-100">
                    <div className="mx-auto flex min-h-17 max-w-290 items-center justify-between gap-10 px-4 sm:px-6 lg:px-8">

                        {/* logo */}
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-3"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#079447] text-white">
                                <ShoppingCart size={21} strokeWidth={2} />
                            </div>

                            <div className="flex flex-col">
                                <span className="whitespace-nowrap text-[18px] leading-tight font-extrabold">
                                    বাজার দর
                                </span>

                                <span className="mt-1 whitespace-nowrap text-[10px] text-gray-500">
                                    {banglaDate}
                                </span>
                            </div>
                        </Link>

                        {/* Auth buttons */}

                        {session ? (
                            <div className="relative">

                                <button
                                    type="button"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-3 whitespace-nowrap"
                                >

                                    <img
                                        src="/images/profile-img.webp"
                                        alt="Profile"
                                        className="h-9 w-9 rounded-full object-cover"
                                    />

                                    <span className="text-sm font-medium text-gray-800">
                                        {session.user.name}
                                    </span>

                                    <span className="text-xs text-gray-500">
                                        ▾
                                    </span>

                                </button>

                                {profileOpen && (

                                    <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">

                                        <div className="mb-4">

                                            <p className="font-bold text-gray-900">
                                                {session.user.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {session.user.email}
                                            </p>

                                        </div>

                                        <a
                                            href="/profile"
                                            className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            👤 আমার প্রোফাইল
                                        </a>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 disabled:opacity-60"
                                        >
                                            {loggingOut ? "Signing Out..." : "↩ সাইন আউট"}
                                        </button>
                                    </div>
                                )}
                            </div>

                        ) : (

                            <div className="flex items-center gap-4 whitespace-nowrap">
                                <a
                                    href="/signin"
                                    className="text-sm text-gray-700 hover:text-green-600"
                                >
                                    সাইন ইন
                                </a>
                                <a
                                    href="/signup"
                                    className="rounded-lg bg-[#079447] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
                                >
                                    সাইন আপ
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* catagories */}
                <nav
                    aria-label="পণ্যের ক্যাটাগরি"
                    className="border-b border-gray-100"
                >
                    <div className="mx-auto max-w-290 px-4 sm:px-6 lg:px-8">

                        <div className="flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-7">

                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.id}`}
                                    className="flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-1 text-[12px] font-medium text-gray-600 transition-colors hover:border-[#079447] hover:text-green-600 sm:text-[13px]"
                                >
                                    <span className="inline-flex h-5 w-5 items-center justify-center text-[15px]">
                                        {category.icon}
                                    </span>

                                    <span>{category.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                {/*  Price Ticker */}
                <div className="w-full overflow-hidden border-b border-green-100 bg-[#f4fbf5] py-2.5">

                    <div className="bazar-ticker-animation">

                        <div className="bazar-ticker-group">
                            {renderTickerItems()}
                        </div>
                        <div
                            className="bazar-ticker-group"
                            aria-hidden="true"
                        >
                            {renderTickerItems()}
                        </div>
                    </div>
                </div>

            </header>
        </>
    );
}