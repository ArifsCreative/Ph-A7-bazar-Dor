"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Login failed");
      return;
    }

    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-5">

      <form
        onSubmit={handleSignin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow"
      >

        <h1 className="mb-6 text-3xl font-bold text-green-700">
          Sign In
        </h1>


        <input
          className="mb-3 w-full rounded-lg border p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          className="mb-3 w-full rounded-lg border p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        {error && (
          <p className="mb-3 text-sm text-red-500">
            {error}
          </p>
        )}


        <button
          className="w-full rounded-lg bg-green-600 p-3 text-white hover:bg-green-700"
        >
          Sign In
        </button>

      </form>

    </main>
  );
}