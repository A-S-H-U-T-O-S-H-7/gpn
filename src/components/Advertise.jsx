"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building, User, Mail, Phone, Globe,
  Send, CheckCircle, TrendingUp, Users, ArrowLeft,
} from "lucide-react";
import { Target, BarChart, Headphones } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitAdvertiseInquiry } from "@/lib/services/advertiseService";
import { getContactInfo } from "@/lib/services/settingsService";



export default function AdvertisePage() {
  const router = useRouter();
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    adType: "display",
    budget: "",
    duration: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);

    const result = await submitAdvertiseInquiry(formData);

    if (result.success) {
      setIsSuccess(true);
      toast.success("Inquiry submitted successfully!");
      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        website: "",
        adType: "display",
        budget: "",
        duration: "",
        message: "",
      });
      setTimeout(() => setIsSuccess(false), 6000);
    } else {
      toast.error(result.error || "Failed to submit inquiry");
    }

    setIsSubmitting(false);
  };

  const adTypes = [
    { value: "display", label: "Display Banner" },
    { value: "video", label: "Video Ad" },
    { value: "native", label: "Native Ad" },
    { value: "newsletter", label: "Newsletter Ad" },
    { value: "sponsored", label: "Sponsored Article" },
  ];

  const budgetRanges = [
    { value: "below_10000", label: "Below ₹10,000" },
    { value: "10000_25000", label: "₹10,000 – ₹25,000" },
    { value: "25000_50000", label: "₹25,000 – ₹50,000" },
    { value: "50000_100000", label: "₹50,000 – ₹1,00,000" },
    { value: "above_100000", label: "Above ₹1,00,000" },
  ];

  const durations = [
    { value: "1_week", label: "1 Week" },
    { value: "2_weeks", label: "2 Weeks" },
    { value: "1_month", label: "1 Month" },
    { value: "3_months", label: "3 Months" },
    { value: "6_months", label: "6 Months" },
    { value: "1_year", label: "1 Year" },
  ];

  const whyItems = [
    {
      icon: <Users className="w-4 h-4" />,
      iconBg: "bg-teal-100 dark:bg-teal-900/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      title: "Massive Reach",
      desc: "Over 50 million monthly readers across India",
    },
    {
      icon: <Target className="w-4 h-4" />,
      iconBg: "bg-violet-100 dark:bg-violet-900/40",
      iconColor: "text-violet-600 dark:text-violet-400",
      title: "Targeted Advertising",
      desc: "Reach specific demographics and interests",
    },
    {
      icon: <BarChart className="w-4 h-4" />,
      iconBg: "bg-sky-100 dark:bg-sky-900/40",
      iconColor: "text-sky-600 dark:text-sky-400",
      title: "Performance Analytics",
      desc: "Detailed reports on ad performance",
    },
    {
      icon: <Headphones className="w-4 h-4" />,
      iconBg: "bg-teal-100 dark:bg-teal-900/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      title: "Dedicated Support",
      desc: "24/7 customer support for advertisers",
    },
  ];

  // Contact items from settings
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
      value: contactInfo?.contactEmail || "ads@gpn.com",
      href: `mailto:${contactInfo?.contactEmail || "ads@gpn.com"}`,
      iconBg: "bg-violet-100 dark:bg-violet-900/40",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-violet-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 pb-14 px-4 sm:px-6 lg:px-8 transition-colors duration-300">

      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* ── Back Button ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </motion.div>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-white/10 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 backdrop-blur-sm mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Partner with us
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Advertise{" "}
            <span className="bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent">
              with us
            </span>
          </h1>

          <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Reach millions of readers across India. Choose from our variety of advertising options.
          </p>

          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-teal-400 to-violet-400 mx-auto mt-5" />
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left Info Panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Why advertise */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-400 dark:border-slate-700/60 rounded-2xl shadow-xl shadow-teal-100/40 dark:shadow-none p-7">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Why advertise with GPN?
              </h2>
              <div className="space-y-5">
                {whyItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg} ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 h-1.5 w-full rounded-full bg-gradient-to-r from-teal-400 via-violet-400 to-sky-400 opacity-60" />
            </div>

            {/* Contact strip */}
            <div className="bg-gradient-to-br from-teal-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-500/20 dark:shadow-teal-500/10">
              <h3 className="text-lg font-bold mb-1.5">Ready to get started?</h3>
              <p className="text-sm text-white/80 mb-5 leading-relaxed">
                Our advertising team will reach out within 24 hours of your inquiry.
              </p>
              <div className="space-y-2.5">
                {contactItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2.5 text-sm text-white/90 hover:text-white transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </span>
                    {item.value}
                  </a>
                ))}
                {contactInfo?.phone2 && (
                  <a
                    href={`tel:${contactInfo.phone2.replace(/\s/g, '')}`}
                    className="flex items-center gap-2.5 text-sm text-white/90 hover:text-white transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    {contactInfo.phone2}
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Form Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                    className="flex flex-col items-center justify-center text-center py-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-violet-100 dark:from-teal-900/50 dark:to-violet-900/50 flex items-center justify-center mb-5 shadow-inner">
                      <CheckCircle className="w-10 h-10 text-teal-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Inquiry submitted!
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-xs">
                      Thank you for your interest. Our advertising team will contact you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 to-violet-500 text-white hover:opacity-90 transition-opacity shadow-md"
                    >
                      Submit another inquiry
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Heading */}
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-400 to-violet-400" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Advertise inquiry form
                      </h3>
                    </div>

                    {/* Row 1 — Company + Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Company name <span className="text-teal-500">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Your company"
                            required
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Contact person <span className="text-teal-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            placeholder="Full name"
                            required
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2 — Email + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            placeholder="you@company.com"
                            required
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                          />
                        </div>
                      </div>

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
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://yourcompany.com"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Row 3 — Ad Type + Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Ad type <span className="text-teal-500">*</span>
                        </label>
                        <select
                          name="adType"
                          value={formData.adType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                        >
                          {adTypes.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Budget range <span className="text-teal-500">*</span>
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                        >
                          <option value="">Select budget</option>
                          {budgetRanges.map((b) => (
                            <option key={b.value} value={b.value}>{b.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Campaign duration <span className="text-teal-500">*</span>
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                      >
                        <option value="">Select duration</option>
                        {durations.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Message / requirements <span className="text-teal-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about your advertising requirements…"
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-xl resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all duration-200"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-bold tracking-wide text-white bg-gradient-to-r from-teal-500 to-violet-500 hover:from-teal-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-teal-400/50 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-teal-500/25 dark:shadow-teal-500/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit inquiry
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