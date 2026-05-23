"use client";

import { Calendar, Image as ImageIcon, Upload, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BlogSidebar({ formData, onInputChange, onSubmit, isLoading, isDark }) {
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

  const getButtonText = () => {
    if (isLoading) return formData.status === 'published' ? "Publishing..." : "Saving...";
    return formData.status === 'published' ? "Publish Post" : "Save as Draft";
  };

  return (
    <div className="space-y-6">
      {/* Post Status */}
      <div className={`rounded-xl border p-5 ${isDark ? "bg-gray-800 border-rose-500/60" : "bg-white border-rose-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Calendar className={`w-4 h-4 ${isDark ? "text-red" : "text-red"}`} />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Post Status
          </h3>
        </div>

        <select
          value={formData.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red/20 focus:outline-none ${
            isDark
              ? "bg-gray-700 border-rose-500/50 text-white focus:border-rose-400"
              : "bg-gray-50 border-rose-300 text-gray-900 focus:border-rose-500"
          }`}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Featured Image */}
      <div className={`rounded-xl border p-5 ${isDark ? "bg-gray-800 border-rose-500/60" : "bg-white border-rose-300"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <ImageIcon className={`w-4 h-4 ${isDark ? "text-red" : "text-red"}`} />
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
              ? "border-rose-500/60 hover:border-rose-400 bg-gray-700/50"
              : "border-rose-300 hover:border-rose-500 bg-gray-50"
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
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
          formData.status === 'published'
            ? "bg-red hover:bg-red-600 text-white shadow-lg"
            : isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white border border-rose-500/60"
              : "bg-white hover:bg-gray-50 text-gray-900 border border-rose-300"
        }`}
      >
        <Save className="w-4 h-4" />
        <span>{getButtonText()}</span>
      </button>
    </div>
  );
}
