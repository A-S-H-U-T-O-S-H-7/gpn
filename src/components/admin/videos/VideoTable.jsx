"use client";

import Pagination from "../Pagination";
import VideoTableRow from "./VideoTableRow";

export default function VideoTable({ 
  videos, 
  currentPage, 
  totalPages, 
  isUpdating, 
  isDark, 
  onEdit, 
  onDelete, 
  onPageChange 
}) {
  const itemsPerPage = 10;

  if (videos.length === 0) {
    return (
      <div className={`rounded-xl border-2 p-12 text-center ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>No videos found</p>
        <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Create your first video to get started</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-opacity duration-200 ${isUpdating ? 'opacity-70' : 'opacity-100'} ${
      isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`bg-linear-to-r from-red-600 via-red-400 to-rose-400 text-gray-100 border-b-2 ${isDark ? "border-red-500/40" : "border-red-300"}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-red-500/25" : "divide-red-200"}`}>
            {videos.map((video, index) => (
              <VideoTableRow
                key={video.id}
                video={video}
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