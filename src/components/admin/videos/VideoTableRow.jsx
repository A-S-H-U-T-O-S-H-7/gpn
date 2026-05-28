"use client";

import { Edit, Trash2, Eye, Calendar, Star, TrendingUp, Zap } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function VideoTableRow({ video, index, currentPage, itemsPerPage, isDark, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700";
      case "draft":
        return isDark ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-700";
      default:
        return isDark ? "bg-gray-700/30 text-gray-300" : "bg-gray-100 text-gray-700";
    }
  };

  return (
    <tr
      className={`border-b transition-colors ${
        isDark
          ? `${index % 2 === 0 ? "bg-gray-900/35" : "bg-gray-800/75"} border-red-500/25 hover:bg-red-950/20`
          : `${index % 2 === 0 ? "bg-white" : "bg-gray-100/70"} border-red-200 hover:bg-red-50`
      }`}
    >
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-900">
          {video.thumbnail ? (
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaYoutube className="w-6 h-6 text-red" />
            </div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              {video.title}
            </div>
            
            {/* Featured Badge */}
            {video.isFeatured && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded">
                <Star className="w-2.5 h-2.5" />
                FEATURED
              </span>
            )}
            
            {/* Editor's Pick Badge */}
            {video.isEditorPick && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded">
                <Star className="w-2.5 h-2.5" />
                EDITOR'S PICK
              </span>
            )}
            
            {/* Trending Badge */}
            {video.isTrending && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">
                <TrendingUp className="w-2.5 h-2.5" />
                TRENDING
              </span>
            )}
          </div>
          {video.duration && (
            <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Duration: {video.duration}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(video.status)}`}>
          {video.status || 'draft'}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <Calendar className="w-3 h-3" />
          <span>{formatDate(video.publishedAt || video.createdAt)}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-gray-400" />
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {video.views?.toLocaleString() || '0'}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/videos/manage/${video.id}`}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(video.id, video.title)}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}