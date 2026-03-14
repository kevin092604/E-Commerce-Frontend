import { useState, useEffect } from "react";
import { api } from "../../api/client";

const STATUS_LABELS = {
  CONFIRMED: "Confirmado", PROCESSING: "Procesando",
  SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado",
};
const STATUS_COLORS = {
  CONFIRMED: "bg-blue-100 text-blue-700", PROCESSING: "bg-amber-100 text-amber-700",
  SHIPPED: "bg-purple-100 text-purple-700", DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">{label}</p>
        <span className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-500">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats").then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Cargando estadísticas...</div>;
  if (!stats) return <div className="p-8 text-red-500">Error al cargar estadísticas.</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Resumen general de la tienda</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ingresos totales" value={`L ${Math.round(stats.totalRevenue).toLocaleString()}`} sub="Total acumulado" icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
        } />
        <StatCard label="Pedidos" value={stats.totalOrders} sub="Total de órdenes" icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
          </svg>
        } />
        <StatCard label="Usuarios" value={stats.totalUsers} sub="Registrados" icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-4-4h-1M9 20H4v-2a4 4 0 0 1 4-4h1m4-4a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm6 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
          </svg>
        } />
        <StatCard label="Productos" value={stats.totalProducts} sub="Activos en tienda" icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        } />
      </div>

      {/* Orders by status */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-serif font-bold text-gray-900 dark:text-white mb-4">Órdenes por estado</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <div key={status} className={`px-4 py-2 rounded-xl text-sm font-semibold ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}>
              {STATUS_LABELS[status] || status}: {count}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="font-serif font-bold text-gray-900 dark:text-white mb-4">Productos más vendidos</h2>
          <ul className="space-y-3">
            {stats.topProducts.map((item, i) => (
              <li key={item.productId} className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-bold w-5">#{i + 1}</span>
                {item.product?.image && (
                  <img src={item.product.image} alt={item.product?.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.product?.name}</p>
                  <p className="text-xs text-gray-400">{item.product?.brand}</p>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {item._sum.quantity} uds.
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent orders */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="font-serif font-bold text-gray-900 dark:text-white mb-4">Órdenes recientes</h2>
          <ul className="space-y-3">
            {stats.recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{order.user?.name}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("es-HN")}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[order.status] || ""}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    L {Math.round(order.total).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
