import Image from "next/image";
import localFont from "next/font/local";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth", { email, password });
      console.log("Token:", res.data.token);
      localStorage.setItem("token", res.data.token);
      document.cookie = `token=${res.data.token}; Path=/; SameSite=Strict`;
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || "An error occurred"
      );
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="p-6 bg-white shadow-md rounded" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
