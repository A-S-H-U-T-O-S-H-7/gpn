"use client";

import { Calendar, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function BlogTableRow({ blog, index, currentPage, itemsPerPage, isDark, onEdit, onDelete }) {
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
          ? `${index % 2 === 0 ? "bg-gray-900/35" : "bg-gray-800/75"} border-rose-500/35 hover:bg-rose-950/25`
          : `${index % 2 === 0 ? "bg-white" : "bg-gray-100/70"} border-rose-200 hover:bg-rose-50`
      }`}
    >
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          {blog.image ? (
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className={`text-sm font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {blog.title}
          </div>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {blog.excerpt?.substring(0, 100)}...
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(blog.status)}`}>
          {blog.status || 'draft'}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <Calendar className="w-3 h-3" />
          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-gray-400" />
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {blog.views?.toLocaleString() || '0'}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
  href={`/admin/blogs/manage/${blog.id}`}
  className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
    isDark
      ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
  }`}
>
  <Edit className="w-4 h-4" />
</Link>
<button
  onClick={() => onDelete(blog.id, blog.title, blog.image)}
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
