"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Download, Users as UsersIcon, UserCheck, UserX, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import UsersTable from "./UsersTable";
import UserDetailsModal from "./UserDetailsModal";
import { getUsers, updateUserStatus, updateUserSubscription, deleteUser, exportSubscribedUsersToCSV, getUserStats } from "@/lib/services/userService";
import Swal from "sweetalert2";

export default function AdminUsersPage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    subscribedUsers: 0,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsers(currentPage, searchTerm, statusFilter, subscriptionFilter);
      if (result.success) {
        setUsers(result.users);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, subscriptionFilter]);

  const fetchStats = useCallback(async () => {
    const result = await getUserStats();
    if (result.success && result.stats) {
      setStats(result.stats);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleSubscription = async (userId, isSubscribed) => {
    setIsUpdating(true);
    try {
      const result = await updateUserSubscription(userId, isSubscribed, admin);
      if (result.success) {
        toast.success(isSubscribed ? "User subscribed to newsletter" : "User unsubscribed from newsletter");
        fetchUsers();
        fetchStats();
      } else {
        toast.error(result.error || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlockUser = async (user) => {
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    const action = newStatus === 'blocked' ? 'block' : 'unblock';
    
    const result = await Swal.fire({
      title: `${action === 'block' ? 'Block' : 'Unblock'} User?`,
      text: `Are you sure you want to ${action} "${user.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff2b2b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action} user`,
      cancelButtonText: "Cancel",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        const updateResult = await updateUserStatus(user.id, newStatus, admin);
        if (updateResult.success) {
          toast.success(`User ${action}ed successfully`);
          fetchUsers();
          fetchStats();
        } else {
          toast.error(updateResult.error || `Failed to ${action} user`);
        }
      } catch (error) {
        console.error("Error updating user status:", error);
        toast.error(`Failed to ${action} user`);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${user.name}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff2b2b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete user",
      cancelButtonText: "Cancel",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        const deleteResult = await deleteUser(user.id, user.name, admin);
        if (deleteResult.success) {
          toast.success("User deleted successfully");
          fetchUsers();
          fetchStats();
        } else {
          toast.error(deleteResult.error || "Failed to delete user");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete user");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleExportSubscribers = async () => {
    const result = await exportSubscribedUsersToCSV();
    if (result.success) {
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${result.count} subscribers`);
    } else {
      toast.error("Failed to export subscribers");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>Users</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
              Manage registered users and newsletter subscribers
            </p>
          </div>
        </div>
        <button
          onClick={handleExportSubscribers}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Subscribers
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-xl border-2 p-4 ${isDarkMode ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Users</p>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.totalUsers}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
        
        <div className={`rounded-xl border-2 p-4 ${isDarkMode ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Active Users</p>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className={`rounded-xl border-2 p-4 ${isDarkMode ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Blocked Users</p>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.blockedUsers}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
        
        <div className={`rounded-xl border-2 p-4 ${isDarkMode ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Subscribers</p>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.subscribedUsers}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none ${
              isDarkMode
                ? "bg-gray-800 border-red-500/40 text-white focus:border-red"
                : "bg-white border-red-300 text-gray-900 focus:border-red"
            }`}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-red-500/40 text-white focus:border-red"
              : "bg-white border-red-300 text-gray-900 focus:border-red"
          }`}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>

        <select
          value={subscriptionFilter}
          onChange={(e) => {
            setSubscriptionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-red/20 focus:outline-none cursor-pointer ${
            isDarkMode
              ? "bg-gray-800 border-red-500/40 text-white focus:border-red"
              : "bg-white border-red-300 text-gray-900 focus:border-red"
          }`}
        >
          <option value="all">All Users</option>
          <option value="subscribed">Subscribed Only</option>
          <option value="not_subscribed">Not Subscribed</option>
        </select>
      </div>

      {/* Total Records */}
      {!loading && users.length > 0 && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Total: {totalItems} user{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <UsersTable
          users={users}
          currentPage={currentPage}
          totalPages={totalPages}
          isUpdating={isUpdating}
          isDark={isDarkMode}
          onView={handleViewUser}
          onBlock={handleBlockUser}
          onDelete={handleDeleteUser}
          onToggleSubscription={handleToggleSubscription}
          onPageChange={setCurrentPage}
        />
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        isDark={isDarkMode}
      />
    </div>
  );
}