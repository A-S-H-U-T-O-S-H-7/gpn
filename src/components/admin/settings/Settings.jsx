"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import SeoSettings from "@/components/admin/settings/SeoSettings";
import SocialLinks from "@/components/admin/settings/SocialLinks";
import ContactSettings from "@/components/admin/settings/ContactSettings";
import { 
  getSettings, 
  updateGeneralSettings, 
  updateSeoSettings, 
  updateSocialLinks, 
  updateContactSettings 
} from "@/lib/services/settingsService";

const tabs = [
  { id: "general", name: "General", icon: "⚙️" },
  { id: "seo", name: "SEO", icon: "🔍" },
  { id: "social", name: "Social Links", icon: "📱" },
  { id: "contact", name: "Contact", icon: "📞" }, // NEW TAB
];

export default function SettingsPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const result = await getSettings();
      if (result.success) {
        setSettings(result.settings);
      } else {
        toast.error("Failed to load settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGeneral = async (data) => {
    const result = await updateGeneralSettings(data, admin);
    if (result.success) {
      toast.success("General settings updated");
      fetchSettings();
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  const handleUpdateSeo = async (data) => {
    const result = await updateSeoSettings(data, admin);
    if (result.success) {
      toast.success("SEO settings updated");
      fetchSettings();
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  const handleUpdateSocial = async (data) => {
    const result = await updateSocialLinks(data, admin);
    if (result.success) {
      toast.success("Social links updated");
      fetchSettings();
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  // NEW: Handle contact settings update
  const handleUpdateContact = async (data) => {
    const result = await updateContactSettings(data, admin);
    if (result.success) {
      toast.success("Contact information updated");
      fetchSettings();
    } else {
      toast.error(result.error || "Failed to update contact info");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isDarkMode
              ? "border-rose-500/60 text-rose-600 bg-rose-100 hover:bg-rose-950/40"
              : "border-rose-300 text-rose-600 bg-rose-200 hover:bg-rose-50"
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>Settings</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
            Manage your website configuration
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "text-red border-b-2 border-red"
                : isDarkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "general" && settings?.general && (
          <GeneralSettings
            settings={settings.general}
            onUpdate={handleUpdateGeneral}
            isDark={isDarkMode}
          />
        )}
        
        {activeTab === "seo" && settings?.seo && (
          <SeoSettings
            settings={settings.seo}
            onUpdate={handleUpdateSeo}
            isDark={isDarkMode}
          />
        )}
        
        {activeTab === "social" && settings?.social && (
          <SocialLinks
            settings={settings.social}
            onUpdate={handleUpdateSocial}
            isDark={isDarkMode}
          />
        )}
        
        {/* NEW: Contact Tab */}
        {activeTab === "contact" && settings?.contact && (
          <ContactSettings
            settings={settings.contact}
            onUpdate={handleUpdateContact}
            isDark={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}