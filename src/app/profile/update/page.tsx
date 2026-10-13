"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function UpdateProfilePage() {

    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (session?.user.name) {
            setName(session.user.name);
        }

    }, [session]);

    async function handleUpdate() {

        if (!name.trim()) {
            toast.error("নাম লিখুন");
            return;
        }

        setLoading(true);

        const { error } = await authClient.updateUser({
            name,
        });

        if (error) {

            toast.error(error.message);

        }
        else {

            toast.success("Information updated");

            router.push("/profile");

        }
        setLoading(false);

    }

    if (isPending || !session) {

        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#f7faf7] px-4 py-10">
                <div className="mx-auto max-w-md">

                    <h1 className="mb-8 text-3xl font-bold">
                        তথ্য আপডেট করুন
                    </h1>

                    <div className="rounded-2xl border bg-white p-6">

                        <label className="mb-2 block">
                            নাম
                        </label>

                        <input

                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border px-4 py-3"

                        />

                        <button

                            onClick={handleUpdate}
                            disabled={loading}
                            className="mt-5 w-full rounded-xl bg-[#079447] py-3 text-white"
                        >
                            {loading
                                ? "আপডেট হচ্ছে..."
                                : "Update Information"}

                        </button>
                    </div>
                </div>

            </main>
        </>
    )
}