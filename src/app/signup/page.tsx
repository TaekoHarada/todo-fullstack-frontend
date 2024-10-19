// pages/signup.js
"use client";

import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SIGNUP_API_URL = `${BASE_URL}/api/users/signup`;

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await axiosInstance.post(SIGNUP_API_URL, { username, password });
      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Signup</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-4"
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4"
        placeholder="Password"
      />
      <button
        onClick={handleSignup}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Signup
      </button>
    </div>
  );
}
