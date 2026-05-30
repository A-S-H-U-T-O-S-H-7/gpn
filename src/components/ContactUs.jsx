"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, User, MessageSquare, Tag, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitContactForm } from "@/lib/services/contactService";
import { getContactInfo } from "@/lib/services/settingsService";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  

  // Fetch contact info from settings
  useEffect(() => {
    const fetchContactInfo = async () => {
      const result = await getContactInfo();
      if (result.success) {
        setContactInfo(result.contact);
      }
      setLoading(false);
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);

    const result = await submitContactForm(formData);

    if (result.success) {
      setIsSuccess(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 6000);
    } else {
      toast.error(result.error || "Failed to send message");
    }

    setIsSubmitting(false);
  };

  // Dynamic contact items based on fetched data
  const contactItems = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: contactInfo?.phone1 || "+91 1234567890",
      href: `tel:${(contactInfo?.phone1 || "1234567890").replace(/\s/g, '')}`,
      iconBg: "bg-teal-100 dark:bg-teal-900/40",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: contactInfo?.contactEmail || "info@gpn.com",
      href: `mailto:${contactInfo?.contactEmail || "info@gpn.com"}`,
      iconBg: "bg-violet-100 dark:bg-violet-900/40",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: contactInfo?.address || "Great Post News, New Delhi, India - 110001",
      href: null,
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-violet-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 pb-14 px-4 md:px-6 transition-colors duration-300">

      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* ── Back Button ── */}
                <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.3 }}
                 className="mb-6 cursor-pointer"
                >
               <button
                onClick={() => router.back()}
                className="group cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back</span>
                </button>
                </motion.div>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-white/10 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 backdrop-blur-sm mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            We're here to help
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Let's start a{" "}
            <span className="bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent">
              conversation
            </span>
          </h1>

          <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Have a question or want to collaborate? Drop us a message and we'll get back to you promptly.
          </p>

          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-teal-400 to-violet-400 mx-auto mt-5" />
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Info Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-400 dark:border-slate-700/60 rounded-2xl shadow-xl shadow-teal-100/40 dark:shadow-none p-7">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-7">
                Get in touch
              </h2>

              <div className="space-y-6">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg} ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show second phone if exists */}
              {contactInfo?.phone2 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Alternate Number</p>
                  <a
                    href={`tel:${contactInfo.phone2.replace(/\s/g, '')}`}
                    className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600"
                  >
                    {contactInfo.phone2}
                  </a>
                </div>
              )}

              <div className="mt-6 h-1.5 w-full rounded-full bg-gradient-to-r from-teal-400 via-violet-400 to-sky-400 opacity-60" />
            </div>
          </motion.div>

          {/* ── Form Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-400 dark:border-slate-700/60 rounded-2xl shadow-xl shadow-violet-100/40 dark:shadow-none p-3 md:p-5">

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-violet-100 dark:from-teal-900/50 dark:to-violet-900/50 flex items-center justify-center mb-5 shadow-inner">
                      <CheckCircle className="w-10 h-10 text-teal-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Message sent!
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-xs">
                      Thank you for reaching out. We'll get back to you within one business day.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 to-violet-500 text-white hover:opacity-90 transition-opacity shadow-md"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Heading */}
                    <div className="flex items-center  dark:border-slate-600 gap-2.5 mb-3">
                      <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-400 to-violet-400" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Send us a message
                      </h3>
                    </div>

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Full name <span className="text-teal-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            required
                            className="
                              w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
                              bg-white dark:bg-slate-900
                              text-slate-900 dark:text-white
                              placeholder:text-slate-400 dark:placeholder:text-slate-500
                              border border-slate-200 dark:border-slate-700
                              focus:outline-none focus:border-teal-400 dark:focus:border-teal-500
                              focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20
                              transition-all duration-200
                            "
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Email <span className="text-teal-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            required
                            className="
                              w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
                              bg-white dark:bg-slate-900
                              text-slate-900 dark:text-white
                              placeholder:text-slate-400 dark:placeholder:text-slate-500
                              border border-slate-200 dark:border-slate-700
                              focus:outline-none focus:border-teal-400 dark:focus:border-teal-500
                              focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20
                              transition-all duration-200
                            "
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Phone <span className="text-teal-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="10-digit number"
                            maxLength={10}
                            required
                            className="
                              w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
                              bg-white dark:bg-slate-900
                              text-slate-900 dark:text-white
                              placeholder:text-slate-400 dark:placeholder:text-slate-500
                              border border-slate-200 dark:border-slate-700
                              focus:outline-none focus:border-teal-400 dark:focus:border-teal-500
                              focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20
                              transition-all duration-200
                            "
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Subject
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Optional subject"
                            className="
                              w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
                              bg-white dark:bg-slate-900
                              text-slate-900 dark:text-white
                              placeholder:text-slate-400 dark:placeholder:text-slate-500
                              border border-slate-200 dark:border-slate-700
                              focus:outline-none focus:border-teal-400 dark:focus:border-teal-500
                              focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20
                              transition-all duration-200
                            "
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Message <span className="text-teal-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Write your message here…"
                        required
                        className="
                          w-full px-4 py-2.5 text-sm rounded-xl resize-none
                          bg-white dark:bg-slate-900
                          text-slate-900 dark:text-white
                          placeholder:text-slate-400 dark:placeholder:text-slate-500
                          border border-slate-200 dark:border-slate-700
                          focus:outline-none focus:border-teal-400 dark:focus:border-teal-500
                          focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20
                          transition-all duration-200
                        "
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        w-full cursor-pointer flex items-center justify-center gap-2.5
                        py-3.5 px-6 rounded-xl text-sm font-bold tracking-wide text-white
                        bg-gradient-to-r from-teal-500 to-violet-500
                        hover:from-teal-600 hover:to-violet-600
                        focus:outline-none focus:ring-2 focus:ring-teal-400/50
                        disabled:opacity-60 disabled:cursor-not-allowed
                        shadow-lg shadow-teal-500/25 dark:shadow-teal-500/10
                        transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]
                      "
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12" cy="12" r="10"
                              stroke="currentColor" strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}