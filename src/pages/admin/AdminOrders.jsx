import { useState, useEffect } from "react";
import { api } from "../../api/client";

const STATUSES = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_LABELS = { CONFIRMED: "Confirmado", PROCESSING: "Procesando", SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado" };
const STATUS_COLORS = { CONFIRMED: "bg-blue-100 text-blue-700", PROCESSING: "bg-amber-100 text-amber-700", SHIPPED: "bg-purple-100 text-purple-700", DELIVERED: "bg-emerald-100 text-emerald-700", CANCELLED: "bg-red-100 text-red-700" };

export default function AdminOrders() {
  const [data, setData] = useState({ orders: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = (status = statusFilter) => {
    setLoading(true);
    api.get(`/admin/orders${status ? `?status=${status}` : ""}`)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const changeStatus = async (orderId, status) => {
    await api.patch(`/admin/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  const handleFilter = (s) => {
    setStatusFilter(s);
    fetchOrders(s);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Órdenes</h1>
        <p className="text-gray-500 text-sm mt-1">{data.total} órdenes en total</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleFilter("")}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${!statusFilter ? "bg-gray-900 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}
        >
          Todos
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${statusFilter === s ? "bg-gray-900 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"}`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando órdenes...</p>
      ) : (
        <div className="space-y-3">
          {data.orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div
                className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">#{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    {order.giftWrap && <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">🎁 Regalo</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {order.user?.name} · {order.user?.email} · {new Date(order.createdAt).toLocaleDateString("es-HN")}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Change status */}
                  <select
                    value={order.status}
                    onChange={(e) => { e.stopPropagation(); changeStatus(order.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <span className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                    L {Math.round(order.total).toLocaleString()}
                  </span>
                  <span className="text-gray-400">{expanded === order.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Productos</p>
                      <ul className="space-y-2">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2">
                            <img src={item.product?.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-100" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{item.product?.name}</p>
                              <p className="text-xs text-gray-400">{item.ml}ml · x{item.quantity}</p>
                            </div>
                            <span className="text-xs font-semibold">L {(item.price * item.quantity).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Detalles</p>
                      <p>📍 {order.address?.address}, {order.address?.city}</p>
                      <p>📧 {order.user?.email}</p>
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between"><span>Subtotal</span><span>L {Math.round(order.subtotal).toLocaleString()}</span></div>
                        {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Descuento</span><span>-L {Math.round(order.discount).toLocaleString()}</span></div>}
                        <div className="flex justify-between"><span>Envío</span><span>{order.shipping === 0 ? "Gratis" : `L ${order.shipping}`}</span></div>
                        <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-200 dark:border-gray-600"><span>Total</span><span>L {Math.round(order.total).toLocaleString()}</span></div>
                      </div>
                      {order.giftMessage && <p className="mt-2 italic text-pink-600">🎁 "{order.giftMessage}"</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
