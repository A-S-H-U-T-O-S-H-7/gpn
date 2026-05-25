"use client";

import { Edit, Trash2, Shield, UserCog, PenTool, FileText, Eye } from "lucide-react";

const getRoleIcon = (role) => {
  switch (role) {
    case 'super_admin':
      return Shield;
    case 'admin':
      return UserCog;
    case 'editor':
      return PenTool;
    case 'reporter':
      return FileText;
    default:
      return Eye;
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'super_admin':
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    case 'admin':
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case 'editor':
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case 'reporter':
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

export default function AdminTableRow({ admin, index, currentAdminId, isDark, onEdit, onDelete }) {
  const RoleIcon = getRoleIcon(admin.role);
  const roleColor = getRoleColor(admin.role);
  const isSelf = admin.id === currentAdminId;

  const formatDate = (date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
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
        <div>
          <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {admin.name}
          </div>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {admin.email}
          </div>
        </div>
       </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {admin.username}
        </div>
       </td>
      
      <td className="px-6 py-4">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${roleColor}`}>
          <RoleIcon className="w-3 h-3" />
          {admin.role === 'super_admin' ? 'Super Admin' : admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
        </div>
       </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {formatDate(admin.lastLoginAt)}
        </div>
       </td>
      
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          admin.status === 'active'
            ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
            : isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
        }`}>
          {admin.status}
        </span>
       </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(admin)}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
            title="Edit Admin"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(admin)}
            disabled={isSelf}
            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              isSelf
                ? "opacity-50 cursor-not-allowed"
                : isDark
                  ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
            title={isSelf ? "Cannot delete yourself" : "Delete Admin"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
       </td>
     </tr>
  );
}