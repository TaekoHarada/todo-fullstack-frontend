"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const LOGIN_API_URL = `${BASE_URL}/api/users/login`;
const LOGOUT_API_URL = `${BASE_URL}/api/users/logout`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Initial logout
  useEffect(() => {}, []);

  const handleLogin = async () => {
    try {
      const res = await axiosInstance.post(LOGIN_API_URL, {
        username,
        password,
      });
      console.log("Login response:", res.data);

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(LOGOUT_API_URL); // Call the logout endpoint
      router.push("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
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
        Don&apos;t have an account?
        <Link href="/signup" className="text-blue-500 underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
