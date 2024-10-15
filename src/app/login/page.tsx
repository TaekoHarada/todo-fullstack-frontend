"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://localhost:5001/api/users/login";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Initial logout
  useEffect(() => {}, []);

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post(API_URL, { username, password });
      console.log("Login response:", res.data);

      router.push("/");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.log("setError");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
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
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Login
      </button>

      {/* Add a link to the signup page */}
      <p className="text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-500 underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
