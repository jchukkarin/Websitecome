"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Login success");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1] px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome To Income
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Track your income & expenses easily
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email or Phone number"
            className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-[#f0c777] rounded-full font-semibold text-gray-900 hover:opacity-90 transition"
          >
            Sign in
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-sm text-gray-400">
          — or —
        </div>

        {/* Register */}
        <Link
          href="/register"
          className="block w-full text-center bg-[#dff2a3] py-3 rounded-full text-sm font-medium hover:opacity-90 transition"
        >
          No account?{" "}
          <span className="text-blue-600 font-semibold">
            Create one
          </span>
        </Link>
      </div>
    </div>
  );
}
