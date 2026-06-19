"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Send, CheckCircle, AlertCircle, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { subscribeUser, getSubscriptionStatus } from "@/lib/services/subscriptionService";
import useAuthStore from "@/lib/stores/useAuthStore";

export default function NewsletterSection() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkSubscription = async () => {
      if (isAuthenticated && user?.email) {
        const result = await getSubscriptionStatus(user?.uid, user?.email);
        if (result.success && result.isSubscribed) setAlreadySubscribed(true);
      }
    };
    checkSubscription();
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If user is not logged in, redirect to signup page
    if (!isAuthenticated) {
      toast.error("Please sign up to subscribe to our newsletter");
      router.push("/signup?redirect=newsletter");
      return;
    }
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 3000);
      return;
    }
    setStatus("loading");
    if (alreadySubscribed) {
      setStatus("error");
      setMessage("You are already subscribed to our newsletter!");
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 3000);
      return;
    }
    const subscriberName = isAuthenticated ? user?.name : (name || null);
    const userId = isAuthenticated ? user?.uid : null;
    const result = await subscribeUser(email, subscriberName, userId);
    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setEmail("");
      setName("");
      toast.success(result.message);
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 3000);
    } else {
      setStatus("error");
      setMessage(result.message);
      toast.error(result.message);
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 3000);
    }
  };

  return (
    <section className="py-4 md:py-12">
      <div className="max-w-7xl mx-auto  px-4 md:px-8 lg:px-10">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row items-stretch">

            {/* Left — text block with red tint + bubbles */}
            <div className="relative flex items-center gap-5 px-2 md:px-8 py-10 bg-red-100 dark:bg-red-950/40 lg:w-[46%] flex-shrink-0 overflow-hidden">
              {/* Decorative bubbles */}
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-red-200 dark:bg-red-900/40 pointer-events-none" />
              <div className="absolute -bottom-6 right-12 w-20 h-20 rounded-full bg-red-200/80 dark:bg-red-900/25 pointer-events-none" />

              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                  {alreadySubscribed
                    ? <Bell className="w-7 h-7 text-white" />
                    : <Mail className="w-7 h-7 text-white" />
                  }
                </div>
              </div>

              {/* Text */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {alreadySubscribed ? "You're already a subscriber!" : "Stay updated. Stay ahead."}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  {alreadySubscribed
                    ? "Thank you for being a loyal reader. Share GPN with your friends!"
                    : "Subscribe to our newsletter and never miss the top stories, videos & exclusive updates."
                  }
                </p>
                {!isAuthenticated && !alreadySubscribed && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Already have an account?{" "}
                    <a href="/login" className="text-red-500 dark:text-red-400 hover:underline">Sign in</a> for auto-filled details.
                  </p>
                )}
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block w-px bg-gray-200 dark:bg-gray-700" />
            <div className="block lg:hidden h-px bg-gray-200 dark:bg-gray-700" />

            {/* Right — form */}
            <div className="flex items-center px-2 md:px-8 py-10 flex-1 bg-white dark:bg-gray-900">
              {!alreadySubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                  {!isAuthenticated && (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-4 py-3 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-colors"
                    />
                  )}
                  <div className="flex gap-2.5">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isAuthenticated ? "Confirm your email" : "Enter your email address"}
                      disabled={status === "loading"}
                      required
                      className="flex-1 px-4 py-3 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-colors min-w-0"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {status === "loading" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Subscribing...
                        </>
                      ) : status === "success" ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Subscribed!
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Subscribe now
                        </>
                      )}
                    </button>
                  </div>

                  {message && (
                    <p className={`text-xs flex items-center gap-1.5 ${status === "success" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {message}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    No spam, unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center w-full gap-2 py-2 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">You're subscribed!</p>
                  <p className="text-xs text-green-600 dark:text-green-400">You'll receive our latest updates</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}