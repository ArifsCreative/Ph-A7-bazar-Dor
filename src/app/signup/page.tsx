
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast, Toaster } from "sonner";
import Navbar from "@/components/Navbar";

type SocialProvider = "google" | "github";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | null>(null);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      const message = "Please fill in all fields.";
      setError(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "Password must be at least 8 characters.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (result.error) {
        const message =
          result.error.message || "Signup failed";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Registration successful! Please sign in.");
      router.push("/signin");
      router.refresh();
    } catch {
      const message =
        "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignup(provider: SocialProvider) {
    setSocialLoading(provider);
    setError("");

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/signup",
      });

      if (result.error) {
        const message =
          result.error.message ||
          `${provider} authentication failed`;

        setError(message);
        toast.error(message);
        setSocialLoading(null);
      }
      // BetterAuth user to OAuth provider
    } catch {
      const message = `${provider} authentication failed`;
      setError(message);
      toast.error(message);
      setSocialLoading(null);
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-5">
        <Toaster position="top-right" richColors />

        <div className="w-full max-w-[440px] rounded-2xl border border-[#e5ebe5] bg-white p-6 shadow-sm sm:p-9">
          <h1 className="text-center text-3xl font-extrabold text-[#1b2a1f]">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-2 text-center text-sm text-gray-500">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="signup-name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                নাম
              </label>

              <input
                id="signup-name"
                type="text"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                ইমেইল
              </label>

              <input
                id="signup-email"
                type="email"
                placeholder="ইমেইল"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="signup-password"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-600"
              />

            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="w-full rounded-xl bg-[#237a3d] px-4 py-3 font-semibold text-white transition hover:bg-[#195e2e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">
              অথবা
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignup("google")}
              disabled={loading || socialLoading !== null}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-1 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-60"
            >
              <img
                src="/images/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              {socialLoading === "google"
                ? "Loading..."
                : "Google দিয়ে চালিয়ে যান"}
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignup("github")}
              disabled={loading || socialLoading !== null}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-1 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 fill-current"
              >
                <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.28-1.23-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.64 1.22 3.29.93.1-.73.39-1.22.7-1.5-2.47-.28-5.06-1.24-5.06-5.5 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.27-2.6 5.22-5.08 5.49.4.35.75 1.04.75 2.1v3.11c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
              </svg>
              {socialLoading === "github"
                ? "Loading..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-gray-600">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-semibold text-[#237a3d] hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
