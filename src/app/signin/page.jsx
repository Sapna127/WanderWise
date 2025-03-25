"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { jwtDecode } from 'jwt-decode';  

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        const { token } = await res.json(); // Destructure token from response
        
        // Store the token in localStorage
        localStorage.setItem("authToken", token);
        
        // Decode token to get user info (you'll need jwt-decode package)
        const decoded = jwtDecode(token);
        localStorage.setItem("userId", decoded.userId);
        
        // Redirect to home/dashboard
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.error || "Signin failed");
      }
    } catch (error) {
      console.error("Signin error:", error);
      setError("An error occurred during signin");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column: Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Column: Travel Quote */}
      <div className="w-1/2 bg-blue-600 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            "Travel is the only thing you buy that makes you richer."
          </h2>
          <p className="text-lg">– Anonymous</p>
        </motion.div>
      </div>
    </div>
  );
}