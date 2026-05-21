"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("loading");
    
    setTimeout(() => {
      setStatus("success");
      setMessage("Thanks for subscribing!");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gradient Border Container */}
        <div className="relative rounded-2xl bg-gradient-to-r from-red-50 via-red-100/50 to-red-50 dark:from-red-950/30 dark:via-red-900/20 dark:to-red-950/30 border border-red-200 dark:border-red-800/50 shadow-sm">
          
          {/* Inner Content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              
              {/* Left Side - Email Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                  <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      Stay Updated. Stay Ahead.
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Subscribe to our newsletter and never miss the top stories, videos & exclusive updates.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-64 md:w-72 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition-colors text-sm"
                      disabled={status === "loading"}
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 whitespace-nowrap text-sm shadow-sm"
                    >
                      {status === "loading" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : status === "success" ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Subscribed!
                        </>
                      ) : (
                        "Subscribe Now"
                      )}
                    </button>
                  </form>
                </div>

                {/* Status Message */}
                {message && (
                  <p className={`mt-2 text-sm ${
                    status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}