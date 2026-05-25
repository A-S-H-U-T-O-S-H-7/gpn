"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { ROLES, ROLE_PERMISSIONS } from "@/lib/services/adminManagementService";
import PermissionSelector from "./PermissionSelector";

export default function AdminModal({ isOpen, onClose, onSave, editingAdmin, isSaving, isDark }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "admin",
    permissions: [],
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editingAdmin) {
      setFormData({
        name: editingAdmin.name || "",
        email: editingAdmin.email || "",
        username: editingAdmin.username || "",
        password: "",
        role: editingAdmin.role || "admin",
        permissions: editingAdmin.permissions || [],
        status: editingAdmin.status || "active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "admin",
        permissions: [],
        status: "active",
      });
    }
  }, [editingAdmin, isOpen]);

  const handleRoleChange = (role) => {
    let permissions = [];
    if (role !== "super_admin") {
      permissions = ROLE_PERMISSIONS[role] || [];
    }
    setFormData({ ...formData, role, permissions });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!editingAdmin && !formData.password) newErrors.password = "Password is required";
    if (!editingAdmin && formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${isDark ? "bg-gray-800" : "bg-white"} shadow-2xl`}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {editingAdmin ? "Edit Admin" : "Add New Admin"}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-all ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable with fixed max-height */}
        <div className="overflow-y-auto flex-1" style={{ maxHeight: "calc(90vh - 120px)" }}>
          <div className="p-4 space-y-4">
            {/* Row 1: Name + Username */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                    errors.name
                      ? "border-red-500"
                      : isDark
                        ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                        : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                    errors.username
                      ? "border-red-500"
                      : isDark
                        ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                        : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                  }`}
                  placeholder="Enter username"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
            </div>

            {/* Row 2: Email + Password (only for create) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                    errors.email
                      ? "border-red-500"
                      : isDark
                        ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                        : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {!editingAdmin && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none pr-10 ${
                        errors.password
                          ? "border-red-500"
                          : isDark
                            ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                            : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                </div>
              )}
            </div>

            {/* Row 3: Role + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                    isDark
                      ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                      : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                  }`}
                >
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {ROLES.find(r => r.id === formData.role)?.description}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
                    isDark
                      ? "bg-gray-700 border-red-500/40 text-white focus:border-red"
                      : "bg-gray-50 border-red-300 text-gray-900 focus:border-red"
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Permissions Section - Only for non-super_admin */}
            {formData.role !== "super_admin" && (
              <div className="pt-2">
                <PermissionSelector
                  selectedPermissions={formData.permissions}
                  onChange={(permissions) => setFormData({ ...formData, permissions })}
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (editingAdmin ? "Updating..." : "Creating...") : (editingAdmin ? "Update Admin" : "Create Admin")}
          </button>
        </div>
      </div>
    </div>
  );
}