import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useWishlist } from "../../context/WishlistContext";
import { useReviews } from "../../context/ReviewContext";
import { useCompare } from "../../context/CompareContext";
import QuickViewModal from "../ui/QuickViewModal";

const badgeColors = {
  Bestseller: "bg-amber-500",
  Oferta: "bg-red-500",
  Nuevo: "bg-emerald-500",
  Premium: "bg-purple-600",
  Cult: "bg-indigo-600",
  Icónico: "bg-rose-600",
  Lujo: "bg-yellow-600",
  Clásico: "bg-gray-600",
};

export default function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { addToast } = useToast();
  const { toggle, isWishlisted } = useWishlist();
  const { getAverageRating, getProductReviews } = useReviews();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [showQuickView, setShowQuickView] = useState(false);

  const avg = getAverageRating(product.id);
  const reviewCount = getProductReviews(product.id).length;
  const wishlisted = isWishlisted(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch({ type: "ADD_ITEM", payload: product });
    addToast(`${product.name} agregado al carrito`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product.id);
    addToast(isWishlisted(product.id) ? `${product.name} eliminado de favoritos` : `${product.name} agregado a favoritos`);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
      addToast(`${product.name} añadido al comparador`);
    }
  };

  return (
    <div className="relative group">
      <Link
        to={`/producto/${product.id}`}
        className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.badge && (
            <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-full ${badgeColors[product.badge] || "bg-gray-700"}`}>
              {product.badge}
            </span>
          )}
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
            title={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <span className="text-lg leading-none">{wishlisted ? "❤️" : "🤍"}</span>
          </button>
          {/* Compare button */}
          <button
            onClick={handleCompare}
            className={`absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1.5 rounded-full shadow transition-all ${
              inCompare
                ? "bg-amber-400 text-gray-900"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-700"
            }`}
            title={inCompare ? "Quitar del comparador" : "Añadir al comparador"}
          >
            {inCompare ? "Comparando" : "Comparar"}
          </button>
          {/* Quick view button — visible on hover */}
          <button
            onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
            className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1.5 rounded-full shadow bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Vista rápida"
          >
            👁 Vista rápida
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{product.brand}</p>
          <h3 className="text-gray-900 dark:text-white font-serif font-semibold text-lg mt-0.5 leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.ml}ml · {product.type}</p>

          {/* Stars */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-amber-400 text-sm">{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</span>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-gray-900 dark:text-white font-bold text-lg">L {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-gray-400 text-sm line-through ml-2">L {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors duration-200 font-medium"
            >
              + Carrito
            </button>
          </div>
        </div>
      </Link>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </div>
  );
}
