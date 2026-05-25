"use client";

import { useState, useEffect } from "react";
import { X, Mail, User, CheckCircle, AlertCircle, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { subscribeUser } from "@/lib/services/subscriptionService";
import useAuthStore from "@/lib/stores/useAuthStore";

export default function SubscribeModal({ isOpen, onClose, onSuccess, isDark }) {
  const { user, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email || "");
      setName(user.name || "");
    }
  }, [isAuthenticated, user, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setError("");
        setIsSuccess(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    const result = await subscribeUser(email, name, user?.uid);
    
    if (result.success) {
      setIsSuccess(true);
      toast.success(result.message);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setEmail("");
        setName("");
      }, 2000);
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header with gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700" />
        
        <div className="flex items-center justify-between p-5 pb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDark ? "bg-red-900/30" : "bg-red-100"}`}>
              <Bell className={`w-5 h-5 ${isDark ? "text-red-400" : "text-red-600"}`} />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Subscribe to Newsletter
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 pt-2">
          {!isSuccess ? (
            <>
              <div className="text-center mb-5">
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Get the latest news, exclusive stories, and updates delivered straight to your inbox.
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="text-xs text-green-500">✓ Daily News</span>
                  <span className="text-xs text-blue-500">✓ Breaking Alerts</span>
                  <span className="text-xs text-purple-500">✓ Exclusive Content</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition-all ${
                        error
                          ? "border-red-500"
                          : isDark
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Name <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition-all ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                    defaultChecked
                  />
                  <label htmlFor="agree" className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    I agree to receive news and updates from GPN. I can unsubscribe anytime.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Subscribing...
                    </div>
                  ) : (
                    "Subscribe Now"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Thanks for Subscribing!
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                You'll now receive the latest news and updates from GPN.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
          <p className={`text-center text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}