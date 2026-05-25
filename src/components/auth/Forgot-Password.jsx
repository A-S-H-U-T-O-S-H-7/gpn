"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import useThemeStore from "@/lib/stores/useThemeStore";

export default function ForgotPasswordPage() {
  const { isDarkMode } = useThemeStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Password reset error:", error);
      
      let errorMessage = "Failed to send reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.webp"
                alt="GPN Logo"
                width={60}
                height={60}
                className="w-16 h-16 object-contain"
                priority
              />
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                No worries! Enter your email and we'll send you a reset link.
              </p>
            </div>
            
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </motion.button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Check Your Email</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-red hover:text-red-600 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link href="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-red transition-colors">
                ← Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}