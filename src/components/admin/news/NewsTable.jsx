"use client";

import Pagination from "../Pagination";
import NewsTableRow from "./NewsTableRow";

export default function NewsTable({ 
  news, 
  currentPage, 
  totalPages, 
  isUpdating, 
  isDark, 
  onEdit, 
  onDelete, 
  onPageChange 
}) {
  const itemsPerPage = 10;

  if (news.length === 0) {
    return (
      <div className={`rounded-xl border-2 p-12 text-center ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>No news found</p>
        <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Create your first news article to get started</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-opacity duration-200 ${isUpdating ? 'opacity-70' : 'opacity-100'} ${
      isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? "bg-linear-to-r from-red-600 via-red-400 to-rose-400 text-gray-100" : "bg-linear-to-r from-red-500 via-red-400 to-rose-500 text-gray-800"} border-b-2 ${isDark ? "border-red-500/40" : "border-red-300"}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-red-500/25" : "divide-red-200"}`}>
            {news.map((item, index) => (
              <NewsTableRow
                key={item.id}
                news={item}
                index={index}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                isDark={isDark}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isDark={isDark}
      />
    </div>
  );
}