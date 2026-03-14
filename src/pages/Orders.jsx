import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { getOrders } from "../utils/orders";

const STATUS_LABELS = {
  CONFIRMED: "Confirmado",
  PROCESSING: "Procesando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const statusStyles = {
  Confirmado: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Procesando: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Enviado: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  Entregado: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  Cancelado: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  "En camino": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
};

function normalizeApiOrder(order) {
  return {
    id: `#${order.id}`,
    date: order.createdAt,
    status: STATUS_LABELS[order.status] || order.status,
    giftWrap: order.giftWrap,
    giftMessage: order.giftMessage,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.product?.name,
      image: item.product?.image,
      ml: item.ml,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    discount: order.discount,
    coupon: order.coupon,
    shipping: order.shipping,
    total: order.total,
    customer: {
      address: order.address?.address,
      city: order.address?.city,
      email: null,
    },
  };
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("es-HN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      api.get("/orders")
        .then((data) => setOrders(data.map(normalizeApiOrder)))
        .catch(() => setOrders(getOrders()))
        .finally(() => setLoading(false));
    } else {
      setOrders(getOrders());
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        Cargando pedidos...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-32 text-center">
        <p className="text-6xl mb-6">📦</p>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-3">
          Sin pedidos aún
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Tus órdenes confirmadas aparecerán aquí.
        </p>
        <Link
          to="/catalogo"
          className="inline-block bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors text-sm uppercase tracking-wider"
        >
          Ir al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
        Mis pedidos
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {orders.length} pedido{orders.length !== 1 ? "s" : ""} en total
      </p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Order header */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                    {order.id}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                  {order.giftWrap && (
                    <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2.5 py-1 rounded-full font-semibold">
                      🎁 Regalo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatDate(order.date)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  {order.items.length} producto{order.items.length !== 1 ? "s" : ""} ·{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    L {Math.round(order.total).toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img
                      key={`${item.id}-${i}`}
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium whitespace-nowrap"
                >
                  {expanded === order.id ? "Ocultar ▲" : "Ver detalle ▼"}
                </button>
              </div>
            </div>

            {/* Order detail (expandable) */}
            {expanded === order.id && (
              <div className="border-t border-gray-100 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Items */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-3">
                      Productos
                    </h3>
                    <ul className="space-y-2">
                      {order.items.map((item, i) => (
                        <li key={`${item.id}-${i}`} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">{item.ml}ml · x{item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">
                            L {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-3">
                      Resumen
                    </h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>L {Math.round(order.subtotal).toLocaleString()}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Descuento {order.coupon ? `(${order.coupon})` : ""}</span>
                          <span>-L {Math.round(order.discount).toLocaleString()}</span>
                        </div>
                      )}
                      {order.giftWrap && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Empaque regalo</span>
                          <span>L 150</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Envío</span>
                        <span>{order.shipping === 0 ? "Gratis" : `L ${order.shipping.toLocaleString()}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-200 dark:border-gray-600 mt-1">
                        <span>Total</span>
                        <span>L {Math.round(order.total).toLocaleString()}</span>
                      </div>
                    </div>

                    {order.giftMessage && (
                      <div className="mt-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-3">
                        <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-1">
                          🎁 Mensaje de regalo
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "{order.giftMessage}"
                        </p>
                      </div>
                    )}

                    {(order.customer?.address || order.customer?.city) && (
                      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        {order.customer.address && <p>📍 {order.customer.address}{order.customer.city ? `, ${order.customer.city}` : ""}</p>}
                        {order.customer.email && <p className="mt-1">📧 {order.customer.email}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
