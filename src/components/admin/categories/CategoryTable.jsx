"use client";

import CategoryTableRow from "./CategoryTableRow";

export default function CategoryTable({ categories, isDark, onEdit, onDelete, isUpdating }) {
  if (categories.length === 0) {
    return (
      <div className={`rounded-xl border-2 p-12 text-center ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>No categories found</p>
        <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Create your first category to get started</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-opacity duration-200 ${isUpdating ? 'opacity-70' : 'opacity-100'} ${
      isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? "bg-linear-to-r from-red-600 via-red-400 to-rose-400 text-gray-100" : "bg-linear-to-r from-red-100  to-rose-100 text-gray-800"} border-b-2 ${isDark ? "border-red-500/40" : "border-red-300"}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Color</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-red-500/25" : "divide-red-200"}`}>
            {categories.map((category, index) => (
              <CategoryTableRow
                key={category.id}
                category={category}
                index={index}
                isDark={isDark}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}