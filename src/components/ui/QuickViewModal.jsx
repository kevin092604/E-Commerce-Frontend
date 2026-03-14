import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { useReviews } from "../../context/ReviewContext";

export default function QuickViewModal({ product, onClose }) {
  const { dispatch } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const { getAverageRating, getProductReviews } = useReviews();

  const wishlisted = isWishlisted(product.id);
  const avg = getAverageRating(product.id);
  const reviewCount = getProductReviews(product.id).length;

  const handleAdd = () => {
    dispatch({ type: "ADD_ITEM", payload: product });
    addToast(`${product.name} agregado al carrito`);
    onClose();
  };

  const handleWishlist = () => {
    toggle(product.id);
    addToast(
      isWishlisted(product.id)
        ? `${product.name} eliminado de favoritos`
        : `${product.name} agregado a favoritos`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col sm:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="sm:w-2/5 bg-gray-50 dark:bg-gray-700 flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 sm:h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Close */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold">
                {product.brand}
              </p>
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-1">
                {product.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl leading-none ml-4 flex-shrink-0"
            >
              ×
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {product.ml}ml · {product.type} · {product.category}
          </p>

          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-amber-400 text-sm">
                {"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}
              </span>
              <span className="text-xs text-gray-400">
                {avg.toFixed(1)} ({reviewCount})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              L {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 line-through text-sm">
                  L {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Notes */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Notas</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-400 mb-0.5">Salida</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium leading-snug">{product.notes.top}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Corazón</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium leading-snug">{product.notes.heart}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Base</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium leading-snug">{product.notes.base}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold py-3 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors text-sm uppercase tracking-wider"
            >
              + Carrito
            </button>
            <button
              onClick={handleWishlist}
              className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-amber-400 flex items-center justify-center text-xl transition-colors"
            >
              {wishlisted ? "❤️" : "🤍"}
            </button>
          </div>

          <Link
            to={`/producto/${product.id}`}
            onClick={onClose}
            className="block text-center text-sm text-amber-600 hover:text-amber-700 font-medium mt-3 hover:underline"
          >
            Ver detalle completo →
          </Link>
        </div>
      </div>
    </div>
  );
}
