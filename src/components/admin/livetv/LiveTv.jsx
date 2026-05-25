"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import LiveTvSettings from "./LiveTvSettings";
import ScheduleList from "./ScheduleList";
import ScheduleModal from "./ScheduleModal";
import { getLiveTvSettings, updateLiveTvSettings, getLiveSchedule, addScheduleItem, updateScheduleItem, deleteScheduleItem } from "@/lib/services/liveTvService";
import Swal from "sweetalert2";

export default function LiveTVPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [settings, setSettings] = useState({
    isLive: false,
    youtubeUrl: "",
    title: "",
    description: "",
    viewers: "0",
    quality: "1080p",
  });
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsResult, scheduleResult] = await Promise.all([
        getLiveTvSettings(),
        getLiveSchedule(),
      ]);
      
      if (settingsResult.success && settingsResult.settings) {
        setSettings(settingsResult.settings);
      }
      if (scheduleResult.success) {
        setSchedule(scheduleResult.schedule);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    if (!settings.youtubeUrl) {
      toast.error("Please enter YouTube URL");
      return;
    }
    
    setSaving(true);
    try {
      const result = await updateLiveTvSettings(settings, admin);
      if (result.success) {
        toast.success("Live TV settings saved");
        fetchData();
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSchedule = async (formData) => {
    const result = await addScheduleItem(formData, admin);
    if (result.success) {
      toast.success("Schedule added");
      setIsModalOpen(false);
      fetchData();
    } else {
      toast.error(result.error || "Failed to add schedule");
    }
  };

  const handleEditSchedule = async (formData) => {
    const result = await updateScheduleItem(editingItem.id, formData, admin);
    if (result.success) {
      toast.success("Schedule updated");
      setIsModalOpen(false);
      setEditingItem(null);
      fetchData();
    } else {
      toast.error(result.error || "Failed to update schedule");
    }
  };

  const handleDeleteSchedule = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${item.title}" from schedule?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff2b2b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteScheduleItem(item.id, item.title, admin);
      if (deleteResult.success) {
        toast.success("Schedule deleted");
        fetchData();
      } else {
        toast.error(deleteResult.error || "Failed to delete schedule");
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
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
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>Live TV</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
            Manage live stream settings and schedule
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Stream Settings */}
        <LiveTvSettings
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onSave={handleSaveSettings}
          saving={saving}
          isDark={isDarkMode}
        />

        {/* Schedule List */}
        <div className={`rounded-xl border-2 p-6 ${isDarkMode ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
          <ScheduleList
            schedule={schedule}
            onAdd={openAddModal}
            onEdit={openEditModal}
            onDelete={handleDeleteSchedule}
            isDark={isDarkMode}
          />
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={editingItem ? handleEditSchedule : handleAddSchedule}
        editingItem={editingItem}
        isDark={isDarkMode}
      />
    </div>
  );
}