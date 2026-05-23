"use client";

import Pagination from "../Pagination";
import BlogTableRow from "./BlogTableRow";

export default function BlogTable({ 
  blogs, 
  currentPage, 
  totalPages, 
  isUpdating, 
  isDark, 
  onEdit, 
  onDelete, 
  onPageChange 
}) {
  const itemsPerPage = 10;

  if (blogs.length === 0) {
    return (
      <div className={`rounded-xl border p-12 text-center ${isDark ? "bg-gray-800 border-rose-500/60" : "bg-white border-rose-300"}`}>
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>No blogs found</p>
        <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Create your first blog post to get started</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden transition-opacity duration-200 ${isUpdating ? 'opacity-70' : 'opacity-100'} ${
      isDark ? "bg-gray-800 border-rose-500/60" : "bg-white border-rose-300"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? "bg-linear-to-r from-red-500 to-red-400 text-gray-100" : "bg-linear-to-r from-red-500 to-red-400 text-gray-800"} border-b ${isDark ? "border-rose-500/60" : "border-rose-300"}`}>
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
          <tbody className={`divide-y ${isDark ? "divide-rose-500/35" : "divide-rose-200"}`}>
            {blogs.map((blog, index) => (
              <BlogTableRow
                key={blog.id}
                blog={blog}
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
