"use client";

import { Calendar, Plus, Edit, Trash2, Clock } from "lucide-react";

export default function ScheduleList({ schedule, onAdd, onEdit, onDelete, isDark }) {
  if (schedule.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>No schedule items</p>
        <button
          onClick={onAdd}
          className="mt-3 text-red text-sm font-medium hover:text-red-600 transition-all"
        >
          + Add Program
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isDark ? "bg-red-900/50" : "bg-red-100"}`}>
            <Calendar className={`w-5 h-5 text-red`} />
          </div>
          <h3 className={`text-lg font-semibold ${isDark ? "text-gray-50" : "text-gray-950"}`}>
            Program Schedule
          </h3>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-red/10 text-red rounded-lg text-sm font-medium hover:bg-red/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {schedule.map((item) => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
            isDark
              ? "border-red-500/30 hover:bg-red-950/20"
              : "border-red-200 hover:bg-red-50"
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-red">{item.startTime}</span>
              {item.endTime && (
                <>
                  <span className="text-gray-400">-</span>
                  <span className="text-sm text-gray-500">{item.endTime}</span>
                </>
              )}
            </div>
            <h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
              {item.title}
            </h4>
            {item.category && (
              <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {item.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? "hover:bg-blue-900/30 text-blue-400"
                  : "hover:bg-blue-100 text-blue-600"
              }`}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? "hover:bg-red-900/30 text-red-400"
                  : "hover:bg-red-100 text-red-600"
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}