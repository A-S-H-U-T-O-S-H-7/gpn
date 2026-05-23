"use client";

import { motion } from "framer-motion";
import { 
  Newspaper, 
  Users, 
  Eye, 
  TrendingUp,
  Video,
  Mail,
  Star,
  ArrowUp,
  ArrowDown,
  FileText
} from "lucide-react";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

const stats = [
  { title: "Total News", value: "1,234", change: "+12%", trend: "up", icon: Newspaper, color: "from-red-500 to-red-600" },
  { title: "Total Blogs", value: "567", change: "+8%", trend: "up", icon: FileText, color: "from-orange-500 to-red-500" },
  { title: "Total Videos", value: "89", change: "+5%", trend: "up", icon: Video, color: "from-blue-500 to-cyan-500" },
  { title: "Total Users", value: "45.2K", change: "+18%", trend: "up", icon: Users, color: "from-green-500 to-emerald-500" },
  { title: "Total Views", value: "2.1M", change: "+23%", trend: "up", icon: Eye, color: "from-purple-500 to-indigo-500" },
  { title: "Subscribers", value: "12.5K", change: "-2%", trend: "down", icon: Mail, color: "from-pink-500 to-rose-500" },
];

export default function DashboardPage() {
  const { admin } = useAdminAuthStore();

  return (
    <div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400">from last month</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Newspaper className="w-4 h-4 text-red" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">News article published</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
