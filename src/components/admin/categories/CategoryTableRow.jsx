"use client";

import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function CategoryTableRow({ category, index, isDark, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    return status === 'active'
      ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
      : isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700";
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
          {index + 1}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category.iconEmoji || '📁'}</span>
          <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {category.name}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
          {category.description || '-'}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color || '#ff2b2b' }}
          />
          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {category.color || '#ff2b2b'}
          </span>
        </div>
       </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {category.order || 0}
        </div>
       </td>
      
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(category.status)}`}>
          {category.status || 'active'}
        </span>
       </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/categories/manage/${category.id}`}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete(category.id, category.name)}
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