"use client";

import AdminTableRow from "./AdminTableRow";

export default function AdminTable({ admins, currentAdminId, isDark, onEdit, onDelete }) {
  if (admins.length === 0) {
    return (
      <div className={`rounded-xl border-2 p-12 text-center ${isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"}`}>
        <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>No admins found</p>
        <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Click "Add Admin" to create one</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border-2 overflow-hidden ${
      isDark ? "bg-gray-800 border-red-500/40" : "bg-white border-red-300"
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? "bg-linear-to-r from-red-600 via-red-400 to-rose-400 text-gray-100" : "bg-linear-to-r from-red-100 to-rose-100 text-gray-800"} border-b-2 ${isDark ? "border-red-500/40" : "border-red-300"}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name & Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
             </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? "divide-red-500/25" : "divide-red-200"}`}>
            {admins.map((admin, index) => (
              <AdminTableRow
                key={admin.id}
                admin={admin}
                index={index}
                currentAdminId={currentAdminId}
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