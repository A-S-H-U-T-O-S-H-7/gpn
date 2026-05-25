"use client";

import { useState } from "react";
import { Save, Share2 } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function SocialLinks({ settings, onUpdate, isDark }) {
  const [formData, setFormData] = useState(settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onUpdate(formData);
    setIsLoading(false);
  };

  const socialIcons = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
    youtube: FaYoutube,
    linkedin: FaLinkedin,
  };

  const socialNames = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
  };

  const socialColors = {
    facebook: 'text-[#1877f2]',
    twitter: 'text-[#1da1f2]',
    instagram: 'text-[#e4405f]',
    youtube: 'text-[#ff0000]',
    linkedin: 'text-[#0077b5]',
  };

  const socialPlaceholders = {
    facebook: 'https://facebook.com/your-page',
    twitter: 'https://twitter.com/your-handle',
    instagram: 'https://instagram.com/your-username',
    youtube: 'https://youtube.com/@your-channel',
    linkedin: 'https://linkedin.com/company/your-company',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`rounded-xl border-2 p-6 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Share2 className="w-5 h-5 text-red" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Social Media Links
          </h2>
        </div>

        <div className="space-y-4">
          {Object.entries(formData).map(([key, value]) => {
            const Icon = socialIcons[key];
            const iconColor = socialColors[key];
            const placeholder = socialPlaceholders[key];
            const label = socialNames[key];
            
            return (
              <div key={key}>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {label} URL
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:border-red focus:ring-2 focus:ring-red/20 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder={placeholder}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}