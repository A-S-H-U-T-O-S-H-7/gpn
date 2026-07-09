// components/home/NewsletterSection.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Bell,
  Sparkles,
  Heart
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { subscribeUser, getSubscriptionStatus } from '@/lib/services/subscriptionService';
import useAuthStore from '@/lib/stores/useAuthStore';

export default function NewsletterSection() {
  const router = useRouter();
  // Get auth state directly from store
  const { user, isAuthenticated, loading: authLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Debug: Log auth state
  useEffect(() => {
    console.log('🔐 Auth State:', { 
      isAuthenticated, 
      user: user?.email,
      authLoading,
      userFull: user
    });
  }, [isAuthenticated, user, authLoading]);

  // Check subscription status when auth state changes
  useEffect(() => {
    const checkSubscription = async () => {
      // Wait for auth to load
      if (authLoading) return;
      
      setIsChecking(true);
      
      console.log('🔍 Checking subscription for:', { isAuthenticated, userEmail: user?.email });
      
      if (isAuthenticated && user?.email) {
        try {
          const result = await getSubscriptionStatus(user?.uid, user?.email);
          console.log('📧 Subscription status:', result);
          if (result.success && result.isSubscribed) {
            setAlreadySubscribed(true);
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
        
        // Pre-fill email and name
        setEmail(user.email || '');
        if (user?.displayName) {
          setName(user.displayName);
        }
      } else {
        // Reset if not authenticated
        setAlreadySubscribed(false);
        setEmail('');
        setName('');
      }
      
      setIsChecking(false);
    };
    
    checkSubscription();
  }, [isAuthenticated, user, authLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get fresh auth state
    const { isAuthenticated: freshAuth, user: freshUser } = useAuthStore.getState();
    
    console.log('📝 Submit - Fresh Auth:', { freshAuth, freshUser: freshUser?.email });
    
    if (!freshAuth || !freshUser) {
      toast.error('Please sign up to subscribe to our newsletter');
      router.push('/signup?redirect=newsletter');
      return;
    }
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
      return;
    }

    if (alreadySubscribed) {
      setStatus('error');
      setMessage('You are already subscribed to our newsletter!');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
      return;
    }

    setStatus('loading');
    
    const subscriberName = freshUser?.displayName || name || null;
    const userId = freshUser?.uid || null;
    
    const result = await subscribeUser(email, subscriberName, userId);
    
    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setAlreadySubscribed(true);
      toast.success(result.message);
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
    } else {
      setStatus('error');
      setMessage(result.message);
      toast.error(result.message);
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
    }
  };

  // Show loading while checking auth
  if (authLoading || isChecking) {
    return (
      <section className="py-8 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-cream-50/50 via-white to-cream-50/50 dark:from-brown-900/20 dark:via-brown-900 dark:to-brown-900/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
          <div className="rounded-2xl border border-gold/20 dark:border-gold/10 bg-white dark:bg-brown-800/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Check if user is logged in
  const isLoggedIn = isAuthenticated && user;

  return (
    <section className="py-8 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-cream-50/50 via-white to-cream-50/50 dark:from-brown-900/20 dark:via-brown-900 dark:to-brown-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-gold/20 dark:border-gold/10 bg-white dark:bg-brown-800/80 backdrop-blur-sm shadow-xl overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-stretch">

            {/* Left — Text block with Saffron tint + decorative bubbles */}
            <div className="relative flex items-center gap-5 px-6 md:px-8 py-10 bg-gradient-to-br from-saffron/10 via-gold/5 to-cream-50 dark:from-saffron/20 dark:via-gold/10 dark:to-brown-900/50 lg:w-[46%] flex-shrink-0 overflow-hidden">
              {/* Decorative bubbles */}
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-saffron/20 dark:bg-saffron/10 pointer-events-none" />
              <div className="absolute -bottom-6 right-12 w-20 h-20 rounded-full bg-gold/20 dark:bg-gold/10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold/5 dark:bg-gold/5 pointer-events-none" />
              
              {/* Floating Om Symbol */}
              <div className="absolute bottom-8 left-8 text-6xl text-gold/5 font-serif pointer-events-none">
                ॐ
              </div>

              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-saffron to-gold flex items-center justify-center shadow-lg shadow-gold/20">
                  {alreadySubscribed ? (
                    <Bell className="w-7 h-7 text-white" />
                  ) : (
                    <Mail className="w-7 h-7 text-white" />
                  )}
                </div>
              </div>

              {/* Text */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-brown-900 dark:text-cream-50 leading-snug">
                  {alreadySubscribed ? "✨ You're already a subscriber!" : "Stay connected with divine wisdom."}
                </h3>
                <p className="text-sm text-brown-600 dark:text-cream-50/70 mt-1.5 leading-relaxed">
                  {alreadySubscribed
                    ? "Thank you for being part of our spiritual family. Share Aarambh TV with fellow seekers!"
                    : "Subscribe to our newsletter and receive daily spiritual wisdom, festival updates, and divine insights."
                  }
                </p>
                {!isLoggedIn && !alreadySubscribed && (
                  <p className="text-xs text-brown-500 dark:text-cream-50/50 mt-2">
                    Please{' '}
                    <a href="/login" className="text-saffron hover:text-gold transition-colors font-medium">
                      Login
                    </a>{' '}
                    or{' '}
                    <a href="/signup" className="text-saffron hover:text-gold transition-colors font-medium">
                      Sign Up
                    </a>{' '}
                    to subscribe
                  </p>
                )}
                {isLoggedIn && !alreadySubscribed && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✅ Logged in as <span className="font-medium">{user?.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block w-px bg-gold/10 dark:bg-gold/5" />
            <div className="block lg:hidden h-px bg-gold/10 dark:bg-gold/5" />

            {/* Right — Form */}
            <div className="flex items-center px-6 md:px-8 py-10 flex-1 bg-white dark:bg-brown-900/50">
              {!alreadySubscribed ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                  {!isLoggedIn && (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-4 py-3 rounded-lg text-sm bg-cream-50 dark:bg-brown-900/50 border border-gold/20 dark:border-gold/10 text-brown-900 dark:text-cream-50 placeholder-brown-400 dark:placeholder-cream-50/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-colors"
                    />
                  )}
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isLoggedIn ? "Confirm your email" : "Enter your email address"}
                      disabled={status === "loading"}
                      required
                      className="flex-1 px-4 py-3 rounded-lg text-sm bg-cream-50 dark:bg-brown-900/50 border border-gold/20 dark:border-gold/10 text-brown-900 dark:text-cream-50 placeholder-brown-400 dark:placeholder-cream-50/40 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-colors disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading" || !isLoggedIn}
                      className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 whitespace-nowrap ${
                        isLoggedIn
                          ? 'bg-gradient-to-r from-saffron to-gold hover:shadow-lg hover:shadow-gold/30 active:scale-95'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
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
                          <Sparkles className="w-4 h-4" />
                          {isLoggedIn ? 'Subscribe Now' : 'Login to Subscribe'}
                        </>
                      )}
                    </button>
                  </div>

                  {!isLoggedIn && (
                    <p className="text-xs text-brown-500 dark:text-cream-50/50">
                      Please <a href="/login" className="text-saffron hover:text-gold transition-colors font-medium">login</a> or{' '}
                      <a href="/signup" className="text-saffron hover:text-gold transition-colors font-medium">sign up</a> to subscribe
                    </p>
                  )}

                  {message && (
                    <p className={`text-xs flex items-center gap-1.5 ${
                      status === "success" 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-divine-red dark:text-divine-red/80'
                    }`}>
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {message}
                    </p>
                  )}

                  <p className="text-xs text-brown-400 dark:text-cream-50/40 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-divine-red" />
                    No spam, unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center w-full gap-2 py-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">You're subscribed!</p>
                  <p className="text-xs text-green-600 dark:text-green-400">You'll receive our daily spiritual updates</p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}