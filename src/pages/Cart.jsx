import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const SHIPPING_THRESHOLD = 3500;
const SHIPPING_COST = 350;

export default function Cart() {
  const { items, totalItems, totalPrice, dispatch } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-32 text-center">
        <p className="text-6xl mb-6">&#128717;</p>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Descubre nuestras fragancias y agrega tu favorita.</p>
        <Link
          to="/catalogo"
          className="inline-block bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-amber-500 transition-colors text-sm uppercase tracking-wider"
        >
          Ver catálogo
        </Link>
      </main>
    );
  }

  const freeShipping = totalPrice >= SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : SHIPPING_COST;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">
        Carrito <span className="text-gray-400 text-2xl font-sans font-normal">({totalItems} artículos)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{item.brand}</p>
                <h3 className="font-serif font-semibold text-gray-900 text-lg leading-tight">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.ml}ml · {item.type}</p>
                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">L {(item.price * item.quantity).toLocaleString()}</span>
                    <button
                      onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                      className="text-gray-300 hover:text-red-500 transition-colors text-xl"
                      title="Eliminar"
                    >
                      &#10005;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-serif font-bold text-xl text-gray-900 mb-5">Resumen del pedido</h2>
            <div className="space-y-3 text-sm text-gray-600 mb-5">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} artículos)</span>
                <span>L {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className={freeShipping ? "text-emerald-600 font-medium" : ""}>
                  {freeShipping ? "Gratis" : `L ${SHIPPING_COST.toLocaleString()}`}
                </span>
              </div>
              {!freeShipping && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  Agrega L {(SHIPPING_THRESHOLD - totalPrice).toLocaleString()} más para envío gratis
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>L {(totalPrice + shipping).toLocaleString()}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center bg-gray-900 text-white font-bold py-3 rounded-full hover:bg-amber-500 transition-colors text-sm uppercase tracking-wider"
            >
              Proceder al pago
            </Link>
            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              className="block w-full text-center text-gray-400 hover:text-red-500 text-xs mt-3 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
