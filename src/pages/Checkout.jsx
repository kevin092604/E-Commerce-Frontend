import { useState } from "react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { saveOrder } from "../utils/orders";
import StripePaymentForm from "../components/ui/StripePaymentForm";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SHIPPING_THRESHOLD = 3500;
const SHIPPING_COST = 350;
const GIFT_WRAP_COST = 150;

const COUPONS = {
  VERANO10: { type: "percent", value: 10, label: "10% de descuento" },
  ELITE15: { type: "percent", value: 15, label: "15% de descuento" },
  NUEVO250: { type: "fixed", value: 250, label: "L 250 de descuento" },
  ENVIOGRATIS: { type: "shipping", label: "Envío gratis" },
};

function getEstimatedDelivery() {
  const today = new Date();
  const min = new Date(today);
  const max = new Date(today);
  min.setDate(today.getDate() + 3);
  max.setDate(today.getDate() + 6);
  while (min.getDay() === 0 || min.getDay() === 6) min.setDate(min.getDate() + 1);
  while (max.getDay() === 0 || max.getDay() === 6) max.setDate(max.getDate() + 1);
  const fmt = (d) => d.toLocaleDateString("es-HN", { day: "numeric", month: "long" });
  return `${fmt(min)} – ${fmt(max)}`;
}

export default function Checkout() {
  const { items, totalPrice, dispatch } = useCart();
  const { user } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "payment"
  const [clientSecret, setClientSecret] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: "",
    address: "", city: "", zip: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setCouponError("");
    } else {
      setAppliedCoupon(null);
      setCouponError("Cupón inválido. Prueba: VERANO10, ELITE15, NUEVO250, ENVIOGRATIS");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  // Calculations
  let discount = 0;
  let freeShipping = false;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") discount = Math.round(totalPrice * appliedCoupon.value / 100);
    else if (appliedCoupon.type === "fixed") discount = Math.min(appliedCoupon.value, totalPrice);
    else if (appliedCoupon.type === "shipping") freeShipping = true;
  }
  const shipping = (totalPrice >= SHIPPING_THRESHOLD || freeShipping) ? 0 : SHIPPING_COST;
  const giftCost = giftWrap ? GIFT_WRAP_COST : 0;
  const finalTotal = totalPrice - discount + shipping + giftCost;

  // Persist the order (API + localStorage)
  const persistOrder = async (paymentIntentId = null) => {
    let orderId = `EP-${Date.now()}`;
    if (user) {
      try {
        const created = await api.post("/orders", {
          items: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price, ml: i.ml })),
          address: { address: form.address, city: form.city, zip: form.zip },
          subtotal: totalPrice, discount,
          coupon: appliedCoupon?.code || null,
          giftWrap, giftMessage: giftWrap ? giftMessage : "",
          shipping, total: finalTotal,
          ...(paymentIntentId ? { paymentIntentId } : {}),
        });
        orderId = `#${created.id}`;
      } catch { /* fallback to localStorage */ }
    }
    const order = {
      id: orderId, date: new Date().toISOString(), customer: { ...form },
      items: items.map((i) => ({ ...i })), subtotal: totalPrice, discount,
      coupon: appliedCoupon?.code || null, giftWrap,
      giftMessage: giftWrap ? giftMessage : "", shipping, total: finalTotal,
      status: "Confirmado",
    };
    saveOrder(order);
    setLastOrder(order);
    setSubmitted(true);
    dispatch({ type: "CLEAR_CART" });
  };

  // Step 1: validate form → create payment intent → go to payment step
  const handleContinueToPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (stripePromise && user) {
        const { clientSecret: cs } = await api.post("/payments/create-intent", { amount: finalTotal });
        setClientSecret(cs);
        setStep("payment");
      } else {
        await persistOrder();
      }
    } catch {
      await persistOrder(); // fallback if Stripe setup fails
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Stripe payment confirmed → persist order
  const handlePaymentSuccess = async (paymentIntentId) => {
    setSubmitting(true);
    try {
      await persistOrder(paymentIntentId);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Empty cart ──
  if (items.length === 0 && !submitted) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-400 text-lg mb-4">No tienes productos en el carrito.</p>
        <Link to="/catalogo" className="text-amber-600 hover:underline">Ver catálogo</Link>
      </div>
    );
  }

  // ── Success screen ──
  if (submitted && lastOrder) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-3">
          ¡Pedido confirmado!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-1">
          Gracias por tu compra, <strong>{lastOrder.customer.name || "cliente"}</strong>.
        </p>
        <p className="font-mono text-sm text-amber-600 font-bold mb-2">{lastOrder.id}</p>
        {lastOrder.customer.email && (
          <p className="text-gray-400 text-sm mb-2">
            Recibirás confirmación en <strong>{lastOrder.customer.email}</strong>.
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          📦 Entrega estimada: <strong className="text-gray-700 dark:text-gray-300">{getEstimatedDelivery()}</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/pedidos"
            className="inline-block border-2 border-gray-900 dark:border-gray-400 text-gray-900 dark:text-gray-300 font-bold px-6 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
          >
            Ver mis pedidos
          </Link>
          <Link
            to="/"
            className="inline-block bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold px-6 py-3 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors text-sm uppercase tracking-wider"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400";
  const estimatedDelivery = getEstimatedDelivery();

  // ── Payment step (Stripe) ──
  if (step === "payment" && clientSecret) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => setStep("form")}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          ← Volver al formulario
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, locale: "es", appearance: { theme: "stripe" } }}
            >
              <StripePaymentForm
                onSuccess={handlePaymentSuccess}
                total={finalTotal}
                submitting={submitting}
              />
            </Elements>
          </div>

          {/* Order summary */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 space-y-4">
              <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Tu pedido</h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.ml}ml · x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      L {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between"><span>Subtotal</span><span>L {totalPrice.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Descuento</span><span>-L {discount.toLocaleString()}</span></div>}
                {giftWrap && <div className="flex justify-between text-pink-600 dark:text-pink-400"><span>🎁 Empaque</span><span>L {GIFT_WRAP_COST}</span></div>}
                <div className="flex justify-between"><span>Envío</span><span className={shipping === 0 ? "text-emerald-600" : ""}>{shipping === 0 ? "Gratis" : `L ${SHIPPING_COST}`}</span></div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-700 mt-1">
                  <span>Total</span><span>L {finalTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">📦 Entrega estimada</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{estimatedDelivery}</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    );
  }

  // ── Info form (Step 1) ──
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleContinueToPayment} className="flex-1 space-y-6">
          {/* Personal info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-4">Datos personales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Nombre completo *</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Correo electrónico *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Teléfono</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-4">Dirección de envío</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Dirección *</label>
                <input name="address" value={form.address} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Ciudad *</label>
                <input name="city" value={form.city} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Código postal *</label>
                <input name="zip" value={form.zip} onChange={handleChange} required className={inputClass} />
              </div>
            </div>
          </div>

          {/* Gift wrapping */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-4">🎁 ¿Es un regalo?</h2>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="accent-amber-500 w-5 h-5 rounded" />
              <div>
                <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">Empaque para regalo (+L {GIFT_WRAP_COST})</span>
                <p className="text-xs text-gray-400 mt-0.5">Caja premium con papel de seda y lazo decorativo</p>
              </div>
            </label>
            {giftWrap && (
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Mensaje personalizado (opcional)</label>
                <textarea
                  value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..." rows={3} maxLength={200}
                  className={`${inputClass} resize-none`}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{giftMessage.length}/200</p>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-4">Código de descuento</h2>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-3">
                <div>
                  <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">✓ {appliedCoupon.code}</p>
                  <p className="text-emerald-600 dark:text-emerald-500 text-xs mt-0.5">{appliedCoupon.label}</p>
                </div>
                <button type="button" onClick={removeCoupon} className="text-gray-400 hover:text-red-500 transition-colors text-sm">Quitar</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text" value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                    placeholder="Ej: VERANO10" className={`${inputClass} flex-1`}
                  />
                  <button type="button" onClick={applyCoupon} className="bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors whitespace-nowrap">
                    Aplicar
                  </button>
                </div>
                {couponError && <p className="text-red-500 dark:text-red-400 text-xs">{couponError}</p>}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold py-4 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors text-sm uppercase tracking-wider disabled:opacity-60"
          >
            {submitting
              ? "Procesando..."
              : stripePromise
              ? `Continuar al pago · L ${finalTotal.toLocaleString()}`
              : `Confirmar pedido · L ${finalTotal.toLocaleString()}`}
          </button>
        </form>

        {/* Order summary */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 space-y-4">
            <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Tu pedido</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.ml}ml · x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">L {(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-gray-900 dark:text-gray-200">L {totalPrice.toLocaleString()}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Descuento ({appliedCoupon.code})</span><span>-L {discount.toLocaleString()}</span></div>}
              {freeShipping && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Cupón envío</span><span>Gratis</span></div>}
              {giftWrap && <div className="flex justify-between text-pink-600 dark:text-pink-400"><span>🎁 Empaque regalo</span><span>L {GIFT_WRAP_COST}</span></div>}
              <div className="flex justify-between"><span>Envío</span><span className={shipping === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-gray-200"}>{shipping === 0 ? "Gratis" : `L ${SHIPPING_COST.toLocaleString()}`}</span></div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-700 mt-1">
                <span>Total</span><span>L {finalTotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">📦 Entrega estimada</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{estimatedDelivery}</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
