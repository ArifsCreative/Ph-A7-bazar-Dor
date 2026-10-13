"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfilePage() {

    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [name, setName] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {

        if (session?.user.name) {
            setName(session.user.name);
        }

    }, [session]);

    useEffect(() => {

        if (!isPending && !session) {
            router.push("/signin");
        }

    }, [session, isPending, router]);


    async function handleLogout() {

        await authClient.signOut();

        router.push("/");

    }

    async function handleUpdate() {

        if (!name.trim()) {
            toast.error("নাম খালি রাখা যাবে না");
            return;
        }

        setUpdating(true);

        try {

            const { error } = await authClient.updateUser({
                name,
            });


            if (error) {
                toast.error(error.message || "Update failed");
                return;
            }

            toast.success("প্রোফাইল আপডেট হয়েছে");


            window.location.reload();

        } catch (error) {

            toast.error("Something went wrong");

        } finally {

            setUpdating(false);

        }

    }

    if (isPending || !session) {

        return (
            <div className="flex min-h-screen items-center justify-center">
                লোড হচ্ছে...
            </div>
        );

    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#fafcfb] px-4 py-10">

                <div className="mx-auto max-w-[960px]">

                    {/* Title */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-extrabold text-[#1b2a1f]">
                            আমার প্রোফাইল
                        </h1>

                        <p className="mt-2 text-gray-500">
                            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
                        </p>

                    </div>


                    {/* Profile Cart */}

                    <section className="rounded-2xl border border-[#e1e9e2] bg-white p-6 shadow-sm sm:p-8">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <img
                                    src="/images/profile-img.webp"
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full object-cover ring-4 ring-[#f0f6f0]"
                                />

                                <div>

                                    <h2 className="text-2xl font-extrabold text-[#1b2a1f]">
                                        {session.user.name}
                                    </h2>

                                    <p className="text-gray-500">
                                        {session.user.email}
                                    </p>
                                </div>

                            </div>

                            <button
                                onClick={handleLogout}
                                className="rounded-xl border border-red-500 px-6 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                            >
                                ↩ সাইন আউট
                            </button>
                        </div>

                    </section>




                    {/* info */}

                    <section className="mt-6 rounded-2xl border border-[#e1e9e2] bg-white p-6 shadow-sm sm:p-8">


                        <h2 className="mb-6 text-xl font-bold">
                            তথ্য
                        </h2>

                        <label className="mb-2 block text-sm">
                            নাম
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none focus:border-[#079447]"
                        />
                        <Link
                            href="/profile/update"
                            className="mt-5 block w-full rounded-xl bg-[#079447] py-3 text-center font-semibold text-white"
                        >
                            আপডেট
                        </Link>

                    </section>
                </div>

            </main>

        </>
    );

}
