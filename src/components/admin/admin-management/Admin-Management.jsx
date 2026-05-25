"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import AdminTable from "./AdminTable";
import AdminModal from "./AdminModal";
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from "@/lib/services/adminManagementService";
import Swal from "sweetalert2";

export default function AdminManagementPage() {
  const { isDarkMode } = useThemeStore();
  const { admin: currentAdmin } = useAdminAuthStore();
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllAdmins();
      if (result.success) {
        setAdmins(result.admins);
      } else {
        toast.error(result.error || "Failed to fetch admins");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only super admin can access this page
    if (currentAdmin?.role !== "super_admin") {
      toast.error("Access denied. Super Admin only.");
      router.push("/admin/dashboard");
      return;
    }
    fetchAdmins();
  }, [currentAdmin, router, fetchAdmins]);

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSaveAdmin = async (formData) => {
    setIsSaving(true);
    try {
      let result;
      if (editingAdmin) {
        result = await updateAdmin(editingAdmin.id, formData, currentAdmin);
      } else {
        result = await createAdmin(formData, currentAdmin);
      }
      
      if (result.success) {
        toast.success(editingAdmin ? "Admin updated" : "Admin created");
        setIsModalOpen(false);
        fetchAdmins();
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error("Failed to save admin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete admin "${admin.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff2b2b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteAdmin(admin.id, admin.name, currentAdmin);
      if (deleteResult.success) {
        toast.success("Admin deleted");
        fetchAdmins();
      } else {
        toast.error(deleteResult.error || "Failed to delete admin");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-6">
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
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>Admin Management</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
              Manage system administrators and their permissions
            </p>
          </div>
        </div>
        <button
          onClick={handleAddAdmin}
          className="flex items-center gap-2 px-4 py-2 bg-red hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {/* Total Records */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Total: {admins.length} admin{admins.length !== 1 ? 's' : ''}
      </div>

      {/* Admins Table */}
      <AdminTable
        admins={admins}
        currentAdminId={currentAdmin?.id}
        isDark={isDarkMode}
        onEdit={handleEditAdmin}
        onDelete={handleDeleteAdmin}
      />

      {/* Admin Modal */}
     <AdminModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  }}
  onSave={handleSaveAdmin}
  editingAdmin={editingAdmin}
  isSaving={isSaving}
  isDark={isDarkMode}
/>
    </div>
  );
}