"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles, Tv, Newspaper, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import useAuthStore from "@/lib/stores/useAuthStore";

export default function LoginPage() {
  const { login, googleLogin, isAuthenticated, loading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back to GPN!");
      router.push("/");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    const result = await googleLogin();
    if (result.success) {
      toast.success("Welcome to GPN!");
      router.push("/");
    } else {
      toast.error(result.error || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 transition-colors duration-500 bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        
        {/* Animated blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 lg:grid-cols-2">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <motion.div 
            className="mx-auto mb-6 h-28 w-28 lg:mx-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/logo.webp"
              alt="GPN Logo"
              width={112}
              height={112}
              className="h-full w-full object-contain"
              priority
            />
          </motion.div>
          
          <h1 className="text-4xl font-bold lg:text-5xl text-gray-900 dark:text-white">
            Welcome to <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">GPN</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Your trusted source for breaking news
          </p>
          
          <motion.div 
            className="mt-6 flex items-center justify-center gap-4 text-red lg:justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red/10 rounded-full">
              <Tv className="h-4 w-4" />
              <span className="text-xs font-medium">Live TV</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red/10 rounded-full">
              <Newspaper className="h-4 w-4" />
              <span className="text-xs font-medium">Breaking News</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red/10 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium">Video First</span>
            </div>
          </motion.div>
          
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Join millions of readers worldwide
          </p>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl bg-white/85 dark:bg-white/10 border-red-200/60 dark:border-white/10"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Top red gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700" />
            
            <div className="p-6 lg:p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome Back
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Sign in to continue reading
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-3"
                    >
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border-2 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-red bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border-2 py-2.5 pl-10 pr-12 text-sm outline-none transition-all focus:border-red bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-red-500 hover:text-red-600 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-transparent px-3 text-xs text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200"
              >
                <FcGoogle className="h-5 w-5" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-red-500 hover:text-red-600 font-semibold transition-colors">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
