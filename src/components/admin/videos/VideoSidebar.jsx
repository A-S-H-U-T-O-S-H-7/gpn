"use client";

import { useState, useEffect } from "react";
import { Calendar, Save, Zap, Star, TrendingUp, FolderOpen, Tag, Clock } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getActiveCategories } from "@/lib/services/categoryService";

// Toggle Switch Component
const ToggleSwitch = ({ enabled = false, onChange, label, icon: Icon, isDark }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${enabled ? "text-red" : isDark ? "text-gray-500" : "text-gray-400"}`} />}
        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{label}</span>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={enabled === true}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`block w-10 h-6 rounded-full transition-all duration-200 ${
            enabled ? "bg-red" : isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
            enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
};

export default function VideoSidebar({ formData, onInputChange, onSubmit, isLoading, isDark, videoPreview }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getActiveCategories();
        if (result.success) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleTagsChange = (e) => {
    const value = e.target.value;
    onInputChange('tagsInput', value);
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onInputChange('tags', tagsArray);
  };

  const getButtonText = () => {
    if (isLoading) return formData.status === 'published' ? "Publishing..." : "Saving...";
    return formData.status === 'published' ? "Publish Video" : "Save as Draft";
  };

  return (
    <div className="space-y-6">
      {/* Video Preview */}
      {videoPreview && (
        <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
              <FaYoutube className={`w-4 h-4 text-red`} />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
              Video Preview
            </h3>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
            <iframe
              src={`https://www.youtube.com/embed/${videoPreview}`}
              title="Video Preview"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Post Status */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Calendar className={`w-4 h-4 text-red`} />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Post Status
          </h3>
        </div>

        <select
          value={formData.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDark
              ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
              : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
          }`}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Category & Tags */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <FolderOpen className={`w-4 h-4 text-red`} />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Category & Tags
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Category
            </label>
            {loadingCategories ? (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${isDark ? "border-red-500/40 bg-gray-700" : "border-red-300 bg-gray-50"}`}>
                <div className="w-4 h-4 border-2 border-red border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Loading categories...</span>
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) => onInputChange('category', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
                  isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.iconEmoji} {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Tags (comma separated)
            </label>
            <div className="relative">
              <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                value={formData.tagsInput || formData.tags?.join(', ') || ''}
                onChange={handleTagsChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                }`}
                placeholder="technology, tutorial, review"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Duration (optional)
            </label>
            <div className="relative">
              <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => onInputChange("duration", e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                }`}
                placeholder="12:34"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Options - All Three Toggles */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Star className={`w-4 h-4 text-red`} />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Featured Options
          </h3>
        </div>

        <div className="space-y-4">
          <ToggleSwitch
            enabled={formData.isFeatured}
            onChange={(val) => onInputChange('isFeatured', val)}
            label="Featured Video"
            icon={Star}
            isDark={isDark}
          />
          
          <ToggleSwitch
            enabled={formData.isEditorPick}
            onChange={(val) => onInputChange('isEditorPick', val)}
            label="Editor's Pick"
            icon={Star}
            isDark={isDark}
          />
          
          <ToggleSwitch
            enabled={formData.isTrending}
            onChange={(val) => onInputChange('isTrending', val)}
            label="Trending"
            icon={TrendingUp}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          formData.status === 'published'
            ? "bg-red hover:bg-red-600 text-white shadow-lg"
            : isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white border border-red-500/40"
              : "bg-white hover:bg-gray-50 text-gray-900 border-2 border-red-300"
        }`}
      >
        <Save className="w-4 h-4" />
        <span>{getButtonText()}</span>
      </button>
    </div>
  );
}