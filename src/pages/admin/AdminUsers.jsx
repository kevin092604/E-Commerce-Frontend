import { useState, useEffect } from "react";
import { api } from "../../api/client";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    api.get("/admin/users").then(setUsers).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (!confirm(`¿Cambiar rol de ${user.name} a ${newRole}?`)) return;
    await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
    fetchUsers();
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Usuarios</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} usuarios registrados</p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o email..."
        className="mb-6 w-full max-w-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />

      {loading ? (
        <p className="text-gray-400">Cargando usuarios...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-700">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Órdenes</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{u._count.orders}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("es-HN")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRole(u)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {u.role === "ADMIN" ? "Admin" : "Cliente"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
