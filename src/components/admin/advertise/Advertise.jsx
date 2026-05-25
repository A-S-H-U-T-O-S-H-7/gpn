"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import useThemeStore from "@/lib/stores/useThemeStore";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";
import AdvertiseStatsCards from "./AdvertiseStatsCards";
import AdvertiseTable from "./AdvertiseTable";
import AdvertiseModal from "./AdvertiseModal";
import { getAdvertiseInquiries, updateInquiryStatus, deleteAdvertiseInquiry, getInquiryStats } from "@/lib/services/advertiseService";
import Swal from "sweetalert2";

export default function AdvertisePage() {
  const { isDarkMode } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({ total: 0, pending: 0, contacted: 0, approved: 0, rejected: 0 });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAdvertiseInquiries(currentPage, searchTerm, statusFilter);
      if (result.success) {
        setInquiries(result.inquiries);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || "Failed to fetch inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchStats = useCallback(async () => {
    const result = await getInquiryStats();
    if (result.success) {
      setStats(result.stats);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
    fetchStats();
  }, [fetchInquiries, fetchStats]);

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (inquiryId, status) => {
    const result = await updateInquiryStatus(inquiryId, status, admin);
    if (result.success) {
      toast.success(`Status updated to ${status}`);
      fetchInquiries();
      fetchStats();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  const handleDeleteInquiry = async (inquiry) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete inquiry from "${inquiry.companyName}"?`,
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
      const deleteResult = await deleteAdvertiseInquiry(inquiry.id, admin);
      if (deleteResult.success) {
        toast.success("Inquiry deleted");
        fetchInquiries();
        fetchStats();
      } else {
        toast.error(deleteResult.error || "Failed to delete inquiry");
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pt-1">
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
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-red-500' : 'text-red-500'}`}>Advertise Inquiries</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
              Manage advertising partnership requests
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <AdvertiseStatsCards stats={stats} isDark={isDarkMode} />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company or contact..."
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
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Total Records */}
      {!loading && inquiries.length > 0 && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Total: {totalItems} inquiry{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-3 border-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <AdvertiseTable
          inquiries={inquiries}
          currentPage={currentPage}
          totalPages={totalPages}
          isDark={isDarkMode}
          onView={handleViewInquiry}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteInquiry}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Inquiry Modal */}
      <AdvertiseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInquiry(null);
        }}
        inquiry={selectedInquiry}
        isDark={isDarkMode}
      />
    </div>
  );
}