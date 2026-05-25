"use client";

import { useState, useEffect } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { subscribeUser, getSubscriptionStatus } from "@/lib/services/subscriptionService";
import useAuthStore from "@/lib/stores/useAuthStore";
import Swal from "sweetalert2";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // Check if current user is already subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      if (isAuthenticated && user?.email) {
        const result = await getSubscriptionStatus(user?.uid, user?.email);
        if (result.success && result.isSubscribed) {
          setAlreadySubscribed(true);
        }
      }
    };
    checkSubscription();
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("loading");
    
    // If already subscribed, show info message
    if (alreadySubscribed) {
      setStatus("error");
      setMessage("You are already subscribed to our newsletter!");
      toast.error("You are already subscribed!");
      
      // Show SweetAlert modal for already subscribed
      Swal.fire({
        title: "Already Subscribed!",
        text: "You are already receiving our newsletter. Thank you for being a loyal reader!",
        icon: "info",
        confirmButtonColor: "#ff2b2b",
        background: isAuthenticated ? "#1f2937" : "#ffffff",
        color: isAuthenticated ? "#ffffff" : "#000000",
      });
      
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    
    // Proceed with subscription
    const subscriberName = isAuthenticated ? user?.name : (name || null);
    const userId = isAuthenticated ? user?.uid : null;
    
    const result = await subscribeUser(email, subscriberName, userId);
    
    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setEmail("");
      setName("");
      toast.success(result.message);
      
      // Show beautiful thank you modal for new subscribers
      Swal.fire({
        title: "🎉 Thank You for Subscribing!",
        html: `
          <div class="text-center">
            <p class="mb-2">You've successfully subscribed to the GPN newsletter!</p>
            <p class="text-sm text-gray-500">Get ready for:</p>
            <ul class="text-sm text-left mt-2 inline-block">
              <li>✓ Breaking news alerts</li>
              <li>✓ Exclusive stories</li>
              <li>✓ Weekly digest</li>
              <li>✓ Special offers</li>
            </ul>
            <p class="text-xs text-gray-400 mt-3">Check your inbox for the confirmation email.</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#ff2b2b",
        confirmButtonText: "Continue Reading",
        background: isAuthenticated ? "#1f2937" : "#ffffff",
        color: isAuthenticated ? "#ffffff" : "#000000",
      });
      
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
      setMessage(result.message);
      toast.error(result.message);
      
      // If already subscribed (detected by API), show specific modal
      if (result.message.includes("already subscribed")) {
        Swal.fire({
          title: "Already Subscribed!",
          text: "This email is already in our subscriber list. Thank you for your continued support!",
          icon: "info",
          confirmButtonColor: "#ff2b2b",
          background: isAuthenticated ? "#1f2937" : "#ffffff",
          color: isAuthenticated ? "#ffffff" : "#000000",
        });
      }
      
      setTimeout(() => setStatus("idle"), 3000);
    }
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
                  {alreadySubscribed ? (
                    <Bell className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  ) : (
                    <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  )}
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {alreadySubscribed ? "You're Already a Subscriber!" : "Stay Updated. Stay Ahead."}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {alreadySubscribed 
                        ? "Thank you for being a loyal reader. Share GPN with your friends!"
                        : "Subscribe to our newsletter and never miss the top stories, videos & exclusive updates."
                      }
                    </p>
                    {!isAuthenticated && !alreadySubscribed && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Already have an account? <a href="/login" className="text-red hover:text-red-600">Sign in</a> for auto-filled details.
                      </p>
                    )}
                  </div>

                  {/* Form - Hide if already subscribed */}
                  {!alreadySubscribed && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 min-w-[280px]">
                      {/* Name field - only show if not logged in */}
                      {!isAuthenticated && (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name (optional)"
                          className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition-colors text-sm"
                        />
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={isAuthenticated ? "Confirm your email" : "Enter your email address"}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 transition-colors text-sm"
                          disabled={status === "loading"}
                          required
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
                            <>
                              <Send className="w-4 h-4" />
                              Subscribe Now
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Already Subscribed Button - Show CTA instead of form */}
                  {alreadySubscribed && (
                    <div className="min-w-[280px] text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        You're subscribed!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        You'll receive our latest updates
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Message */}
                {message && (
                  <p className={`mt-3 text-sm ${
                    status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {message}
                  </p>
                )}

                {/* Privacy Note */}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}