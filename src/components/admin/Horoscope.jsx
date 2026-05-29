"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Save, Edit2, Check, X, Calendar, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import { zodiacSigns, getAllHoroscopes, updateAllHoroscopesFromAPI, updateHoroscopeManually } from "@/lib/services/horoscopeService";
import Swal from "sweetalert2";

export default function HoroscopeManagementPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [horoscopes, setHoroscopes] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editingSign, setEditingSign] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchHoroscopes();
  }, [selectedDate]);

  const fetchHoroscopes = async () => {
    setLoading(true);
    try {
      const result = await getAllHoroscopes(selectedDate);
      if (result.success) {
        setHoroscopes(result.horoscopes);
      }
    } catch (error) {
      console.error("Error fetching horoscopes:", error);
      toast.error("Failed to fetch horoscopes");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchFromAPI = async () => {
    const result = await Swal.fire({
      title: "Fetch from API?",
      text: `This will update all horoscopes for ${selectedDate} from VedicAstro API. Any manual changes for this date will be overwritten.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ff2b2b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, fetch from VedicAstro",
      cancelButtonText: "Cancel",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      setUpdating(true);
      try {
        const apiResult = await updateAllHoroscopesFromAPI(admin, 'moon', selectedDate);
        if (apiResult.success) {
        toast.success("Horoscopes updated from VedicAstro successfully!");
          fetchHoroscopes();
        } else {
          toast.error(apiResult.error || "Failed to fetch from API");
        }
      } catch (error) {
        console.error("Error fetching from API:", error);
        toast.error("Failed to fetch from API");
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleEditClick = (sign, horoscope) => {
    setEditingSign(sign);
    setEditData({
      prediction: horoscope?.prediction || "",
      luckyColor: horoscope?.luckyColor || "",
      luckyNumber: horoscope?.luckyNumber || "",
      luckyTime: horoscope?.luckyTime || "",
      mood: horoscope?.mood || "",
    });
  };

  const handleSaveEdit = async (sign) => {
    setUpdating(true);
    try {
        const result = await updateHoroscopeManually(sign, editData, admin, selectedDate);
      if (result.success) {
        toast.success(`${sign} horoscope updated successfully!`);
        setEditingSign(null);
        fetchHoroscopes();
      } else {
        toast.error(result.error || "Failed to update horoscope");
      }
    } catch (error) {
      console.error("Error updating horoscope:", error);
      toast.error("Failed to update horoscope");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSign(null);
    setEditData({});
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getHoroscopeForSign = (sign) => {
    return horoscopes[sign] || null;
  };

  return (
    <div className="pt-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className={`mt-0.5 p-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              isDarkMode
                ? "border-red-500/60 text-red-500 bg-red-200 hover:bg-red-950/40"
                : "border-red-300 text-red-600 bg-red-200 hover:bg-red-50"
            }`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>Horoscope Management</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
              Manage daily horoscope predictions for all zodiac signs
            </p>
          </div>
        </div>
        <button
          onClick={handleFetchFromAPI}
          disabled={updating}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4  ${updating ? "animate-spin" : ""}`} />
          Fetch from API
        </button>
      </div>

      {/* Date Selector */}
      <div className={`mb-6 p-4 rounded-xl border-2 ${isDarkMode ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red" />
            <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Select Date:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className={`px-3 py-1.5 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
              isDarkMode
                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
            }`}
          />
          <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Showing horoscopes for {new Date(selectedDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {zodiacSigns.map((sign) => {
            const horoscope = getHoroscopeForSign(sign.id);
            const isEditing = editingSign === sign.id;
            
            return (
              <div
                key={sign.id}
                className={`rounded-xl border-2 overflow-hidden ${
                  isDarkMode ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"
                }`}
              >
                {/* Header */}
                <div className={`px-5 py-3 border-b ${isDarkMode ? "border-red-500/40 bg-gray-900/50" : "border-red-300 bg-red-50"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{sign.symbol}</span>
                      <div>
                        <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {sign.name}
                        </h3>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {sign.date} • {sign.element}
                        </p>
                      </div>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => handleEditClick(sign.id, horoscope)}
                        className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                          isDarkMode
                            ? "hover:bg-gray-700 text-blue-400"
                            : "hover:bg-gray-100 text-blue-600"
                        }`}
                        title="Edit manually"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Prediction
                        </label>
                        <textarea
                          value={editData.prediction}
                          onChange={(e) => setEditData({ ...editData, prediction: e.target.value })}
                          rows={3}
                          className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none resize-none ${
                            isDarkMode
                              ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                              : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                          }`}
                          placeholder="Enter prediction..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Lucky Color
                          </label>
                          <input
                            type="text"
                            value={editData.luckyColor}
                            onChange={(e) => setEditData({ ...editData, luckyColor: e.target.value })}
                            className={`w-full px-3 py-1.5 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                              isDarkMode
                                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                            }`}
                            placeholder="e.g., Red"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Lucky Number
                          </label>
                          <input
                            type="text"
                            value={editData.luckyNumber}
                            onChange={(e) => setEditData({ ...editData, luckyNumber: e.target.value })}
                            className={`w-full px-3 py-1.5 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                              isDarkMode
                                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                            }`}
                            placeholder="e.g., 7"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Lucky Time
                          </label>
                          <input
                            type="text"
                            value={editData.luckyTime}
                            onChange={(e) => setEditData({ ...editData, luckyTime: e.target.value })}
                            className={`w-full px-3 py-1.5 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                              isDarkMode
                                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                            }`}
                            placeholder="e.g., 10am - 12pm"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Mood
                          </label>
                          <input
                            type="text"
                            value={editData.mood}
                            onChange={(e) => setEditData({ ...editData, mood: e.target.value })}
                            className={`w-full px-3 py-1.5 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                              isDarkMode
                                ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                                : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                            }`}
                            placeholder="e.g., Energetic"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleSaveEdit(sign.id)}
                          disabled={updating}
                          className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4 inline mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : horoscope ? (
                    <div className="space-y-4">
                      <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {horoscope.prediction}
                      </p>
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Lucky Color</p>
                          <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {horoscope.luckyColor || "—"}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Lucky Number</p>
                          <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {horoscope.luckyNumber || "—"}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Lucky Time</p>
                          <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {horoscope.luckyTime || "—"}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Mood</p>
                          <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {horoscope.mood || "—"}
                          </p>
                        </div>
                      </div>
                      {horoscope.isManualOverride && (
                        <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Manually edited
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No horoscope data for this date
                      </p>
                      <button
                        onClick={() => handleEditClick(sign.id, null)}
                        className="mt-3 text-sm text-red hover:text-red-600"
                      >
                        Add manually →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Last updated info */}
      {!loading && (
        <div className="mt-6 text-center">
          <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Click "Fetch from API" to get horoscopes from VedicAstro API
          </p>
        </div>
      )}
    </div>
  );
}
