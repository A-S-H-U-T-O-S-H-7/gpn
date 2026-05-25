"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building, User, Mail, Phone, Globe, 
  DollarSign, Calendar, MessageSquare, Send, 
  CheckCircle, AlertCircle, TrendingUp, Users, Eye
} from "lucide-react";
import { Target, BarChart, Headphones } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitAdvertiseInquiry } from "@/lib/services/advertiseService";

export default function AdvertisePage() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      setTimeout(() => setIsSuccess(false), 5000);
    } else {
      toast.error(result.error || "Failed to submit inquiry");
    }
    
    setIsSubmitting(false);
  };

  const adTypes = [
    { value: "display", label: "Display Banner", desc: "Standard banner ads on website" },
    { value: "video", label: "Video Ad", desc: "Pre-roll / Mid-roll video advertisements" },
    { value: "native", label: "Native Ad", desc: "In-feed sponsored content" },
    { value: "newsletter", label: "Newsletter Ad", desc: "Email newsletter sponsorship" },
    { value: "sponsored", label: "Sponsored Article", desc: "Custom written sponsored content" },
  ];

  const budgetRanges = [
    { value: "below_10000", label: "Below ₹10,000" },
    { value: "10000_25000", label: "₹10,000 - ₹25,000" },
    { value: "25000_50000", label: "₹25,000 - ₹50,000" },
    { value: "50000_100000", label: "₹50,000 - ₹1,00,000" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Advertise With Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Reach millions of readers across India. Choose from our variety of advertising options.
          </p>
          <div className="w-20 h-1 bg-red mx-auto mt-4 rounded-full" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
            <Users className="w-10 h-10 text-red mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">50M+</h3>
            <p className="text-gray-600 dark:text-gray-400">Monthly Readers</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
            <Eye className="w-10 h-10 text-red mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">120+</h3>
            <p className="text-gray-600 dark:text-gray-400">Countries Covered</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
            <TrendingUp className="w-10 h-10 text-red mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24/7</h3>
            <p className="text-gray-600 dark:text-gray-400">Live Coverage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Why Advertise With GPN?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Massive Reach</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Over 50 million monthly readers across India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Targeted Advertising</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reach specific demographics and interests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red/10 flex items-center justify-center flex-shrink-0">
                    <BarChart className="w-4 h-4 text-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Performance Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Detailed reports on ad performance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red/10 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-4 h-4 text-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Dedicated Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">24/7 customer support for advertisers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-red-100 mb-4">
                Fill out the form and our advertising team will contact you within 24 hours.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>ads@gpn.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 1234567890</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Inquiry Submitted!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Thank you for your interest. Our advertising team will contact you soon.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 px-6 py-2 bg-red text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20"
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Person *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20"
                        placeholder="Enter contact person name"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ad Type *
                    </label>
                    <select
                      name="adType"
                      value={formData.adType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20"
                      required
                    >
                      {adTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Budget Range *
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20"
                      required
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map(budget => (
                        <option key={budget.value} value={budget.value}>{budget.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Campaign Duration *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20"
                    required
                  >
                    <option value="">Select duration</option>
                    {durations.map(dur => (
                      <option key={dur.value} value={dur.value}>{dur.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message / Requirements *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 resize-none"
                    placeholder="Tell us about your advertising requirements..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

