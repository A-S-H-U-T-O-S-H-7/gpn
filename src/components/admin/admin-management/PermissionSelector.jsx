"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AVAILABLE_PERMISSIONS } from "@/lib/services/adminManagementService";

export default function PermissionSelector({ selectedPermissions, onChange, isDark }) {
  const [expandedCategories, setExpandedCategories] = useState({
    Dashboard: true,
    News: true,
    Blogs: true,
    Videos: true,
  });

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const togglePermission = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      onChange(selectedPermissions.filter(p => p !== permissionId));
    } else {
      onChange([...selectedPermissions, permissionId]);
    }
  };

  const selectAllInCategory = (category, permissions) => {
    const allIds = permissions.map(p => p.id);
    const allSelected = allIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      onChange(selectedPermissions.filter(p => !allIds.includes(p)));
    } else {
      const newPermissions = [...selectedPermissions];
      allIds.forEach(id => {
        if (!newPermissions.includes(id)) newPermissions.push(id);
      });
      onChange(newPermissions);
    }
  };

  return (
    <div className={`rounded-lg border-2 p-3 ${isDark ? "border-red-500/40 bg-gray-700" : "border-red-300 bg-gray-50"}`}>
      <div className="flex items-center justify-between mb-2">
        <label className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          Custom Permissions
        </label>
        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Select specific permissions
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        {Object.entries(groupedPermissions).map(([category, permissions]) => (
          <div key={category} className={`rounded-lg border ${isDark ? "border-gray-600" : "border-gray-200"} overflow-hidden`}>
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className={`w-full flex items-center justify-between p-2 text-left text-xs font-medium transition-all ${
                isDark ? "hover:bg-gray-600 text-gray-200 bg-gray-800" : "hover:bg-gray-100 text-gray-800 bg-gray-50"
              }`}
            >
              <span>{category}</span>
              {expandedCategories[category] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            
            {expandedCategories[category] && (
              <div className="p-2 pt-1 space-y-1">
                                <button
                  type="button"
                  onClick={() => selectAllInCategory(category, permissions)}
                  className={`text-[10px] mb-1 inline-block ${isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"}`}
                >
                  {permissions.every(p => selectedPermissions.includes(p.id)) ? "Deselect All" : "Select All"}
                </button>
                {permissions.map(permission => (
                  <label key={permission.id} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="w-3 h-3 text-red rounded border-gray-300 focus:ring-red"
                    />
                    <span className={`text-[11px] ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {permission.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}