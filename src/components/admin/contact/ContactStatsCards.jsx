"use client";

import { Mail, Inbox, Eye, CheckCircle } from "lucide-react";

export default function ContactStatsCards({ stats, isDark }) {
  const cards = [
    { title: "Total Messages", value: stats.total, icon: Mail, color: "text-red-500" },
    { title: "Unread", value: stats.unread, icon: Inbox, color: "text-red-500" },
    { title: "Read", value: stats.read, icon: Eye, color: "text-blue-500" },
    { title: "Replied", value: stats.replied, icon: CheckCircle, color: "text-green-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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