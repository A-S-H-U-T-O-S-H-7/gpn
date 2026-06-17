"use client";

import { useState, useEffect } from "react";
import { Calendar, Image as ImageIcon, Upload, X, Save, Zap, Star, TrendingUp, FolderOpen, Tag } from "lucide-react";
import { toast } from "react-hot-toast";
import { getActiveCategories } from "@/lib/services/categoryService";
import AIGenerateButton from "@/components/admin/AIGenerateButton";

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label, icon: Icon, isDark }) => {
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
          checked={enabled}
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

export default function NewsSidebar({ formData, onInputChange, onSubmit, isLoading, isDark }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [tagsInput, setTagsInput] = useState(formData.tags?.join(', ') || '');

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

  // Update tagsInput when formData.tags changes from AI
  useEffect(() => {
    if (formData.tags && Array.isArray(formData.tags)) {
      setTagsInput(formData.tags.join(', '));
    }
  }, [formData.tags]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onInputChange('featuredImage', file);
        onInputChange('featuredImagePreview', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onInputChange('featuredImage', null);
    onInputChange('featuredImagePreview', null);
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onInputChange('tags', tagsArray);
  };

  const getButtonText = () => {
    if (isLoading) return formData.status === 'published' ? "Publishing..." : "Saving...";
    return formData.status === 'published' ? "Publish News" : "Save as Draft";
  };

  return (
    <div className="space-y-6">
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

      {/* Publish Date */}
<div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
  <div className="flex items-center gap-2 mb-4">
    <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
      <Calendar className={`w-4 h-4 text-red`} />
    </div>
    <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
      Publish Date
    </h3>
  </div>
  
  <div>
    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
      Select Publication Date
    </label>
    <input
      type="date"
      value={formData.publishDate || new Date().toISOString().split('T')[0]}
      onChange={(e) => onInputChange('publishDate', e.target.value)}
      className={`w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
        isDark
          ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
          : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
      }`}
    />
    <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
      📅 Set the publication date. News will be ordered by this date.
    </p>
  </div>
</div>

      {/* Category & Tags with AI Tags Generation */}
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
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Tags (comma separated)
              </label>
              {/* <AIGenerateButton
                content={formData.content || formData.title}
                onGenerated={onInputChange}
                type="tags"
                label="Generate Tags"
                size="sm"
              /> */}
            </div>
            <div className="relative">
              <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsChange}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                    : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                }`}
                placeholder="politics, election, india, news"
              />
            </div>
            <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Enter tags separated by commas (e.g., politics, india, election)
            </p>
          </div>
        </div>
      </div>

      {/* Featured Options - Toggle Switches */}
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
            enabled={formData.isBreaking}
            onChange={(val) => onInputChange('isBreaking', val)}
            label="Breaking News"
            icon={Zap}
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

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <ToggleSwitch
              enabled={formData.isHero}
              onChange={(val) => onInputChange('isHero', val)}
              label="⭐ Hero Section Feature"
              icon={Star}
              isDark={isDark}
            />
            {formData.isHero && (
              <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  ⚠️ This news will appear as the Hero Story on homepage. Only one news can be hero at a time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className={`rounded-xl border-2 p-5 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <ImageIcon className={`w-4 h-4 text-red`} />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Featured Image
          </h3>
        </div>

        {formData.featuredImagePreview ? (
          <div className="relative">
            <img
              src={formData.featuredImagePreview}
              alt="Featured"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className={`block w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
            isDark
              ? "border-red-500/40 hover:border-red bg-gray-700/50"
              : "border-red-300 hover:border-red bg-gray-50"
          }`}>
            <div className="flex flex-col items-center justify-center h-full">
              <Upload className={`w-10 h-10 mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Click to upload image
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                Max size: 5MB
              </p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        )}
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