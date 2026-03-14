import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { useReviews } from "../context/ReviewContext";
import { useCompare } from "../context/CompareContext";
import { addToRecentlyViewed } from "../utils/recentlyViewed";
import ProductCard from "../components/products/ProductCard";
import ReviewSection from "../components/products/ReviewSection";

function getSizeVariants(product) {
  const { price, ml } = product;
  const ppm = price / ml;

  const smallMl = ml <= 50 ? 30 : 50;
  const largeMl = ml <= 100 ? 200 : Math.round(ml * 2 / 5) * 5;

  const variants = [
    { ml: smallMl, price: Math.round(ppm * smallMl * 1.1 / 50) * 50 },
    { ml, price },
    { ml: largeMl, price: Math.round(ppm * largeMl * 0.85 / 50) * 50 },
  ];

  // Remove duplicates
  return variants.filter((v, i, arr) => arr.findIndex((x) => x.ml === v.ml) === i);
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { dispatch } = useCart();
  const { addToast } = useToast();
  const { toggle, isWishlisted } = useWishlist();
  const { getAverageRating, getProductReviews } = useReviews();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id);
      setSelectedVariant(null); // reset on product change
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-400 text-lg">Producto no encontrado.</p>
        <Link to="/catalogo" className="text-amber-600 hover:underline mt-4 inline-block">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const variants = getSizeVariants(product);
  const activeVariant = selectedVariant || variants[1];

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const wishlisted = isWishlisted(product.id);
  const inCompare = isInCompare(product.id);
  const avg = getAverageRating(product.id);
  const reviewCount = getProductReviews(product.id).length;

  const handleAdd = () => {
    dispatch({ type: "ADD_ITEM", payload: { ...product, price: activeVariant.price, ml: activeVariant.ml } });
    addToast(`${product.name} (${activeVariant.ml}ml) agregado al carrito`);
  };

  const handleWishlist = () => {
    toggle(product.id);
    addToast(wishlisted ? `${product.name} eliminado de favoritos` : `${product.name} agregado a favoritos`);
  };

  const handleCompare = () => {
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
      addToast(`${product.name} añadido al comparador`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-amber-600">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/catalogo" className="hover:text-amber-600">Catálogo</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
      </nav>

      {/* Product */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Image — click to zoom */}
        <div
          className="bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden aspect-square cursor-zoom-in relative group"
          onClick={() => setLightboxOpen(true)}
          title="Clic para ampliar"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            🔍 Ampliar
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="text-amber-600 text-sm uppercase tracking-widest font-semibold mb-1">{product.brand}</p>
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            {product.type} · {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </p>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-400 text-lg">{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {avg.toFixed(1)} · {reviewCount} reseña{reviewCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Size variants */}
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
              Tamaño
            </p>
            <div className="flex gap-2 flex-wrap">
              {variants.map((v) => (
                <button
                  key={v.ml}
                  onClick={() => setSelectedVariant(v)}
                  className={`flex flex-col items-center px-4 py-2.5 rounded-xl border-2 transition-all duration-150 ${
                    activeVariant.ml === v.ml
                      ? "border-gray-900 dark:border-amber-400 bg-gray-900 dark:bg-amber-400 text-white dark:text-gray-900"
                      : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-400"
                  }`}
                >
                  <span className="font-bold text-sm">{v.ml} ml</span>
                  <span className="text-xs opacity-80">L {v.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              L {activeVariant.price.toLocaleString()}
            </span>
            {product.originalPrice && activeVariant.ml === product.ml && (
              <>
                <span className="text-gray-400 text-lg line-through">L {product.originalPrice.toLocaleString()}</span>
                <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{product.description}</p>

          {/* Notes */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">Notas olfativas</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Salida</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{product.notes.top}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Corazón</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{product.notes.heart}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Base</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{product.notes.base}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold py-4 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors duration-200 text-sm uppercase tracking-wider"
            >
              Agregar al carrito
            </button>
            <button
              onClick={handleWishlist}
              className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-amber-400 flex items-center justify-center text-2xl transition-colors"
              title={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              {wishlisted ? "❤️" : "🤍"}
            </button>
            <button
              onClick={handleCompare}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
                inCompare
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30"
                  : "border-gray-200 dark:border-gray-600 hover:border-amber-400"
              }`}
              title={inCompare ? "Quitar del comparador" : "Añadir al comparador"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white text-5xl leading-none hover:text-gray-300 transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>
          <img
            src={product.image.replace("w=500&h=500", "w=1200&h=1200")}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Reviews */}
      <ReviewSection productId={product.id} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
