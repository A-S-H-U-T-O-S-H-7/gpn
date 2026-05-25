"use client";

import { FileText, Clock, Phone, CheckCircle, XCircle } from "lucide-react";

export default function AdvertiseStatsCards({ stats, isDark }) {
  const cards = [
    { title: "Total Inquiries", value: stats.total, icon: FileText, color: "text-red-500" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { title: "Contacted", value: stats.contacted, icon: Phone, color: "text-blue-500" },
    { title: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-500" },
    { title: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-xl border-2 p-4 ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{card.title}</p>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{card.value}</p>
            </div>
            <card.icon className={`w-8 h-8 ${card.color} opacity-50`} />
          </div>
        </div>
      ))}
    </div>
  );
}