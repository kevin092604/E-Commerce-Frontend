import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { products } from "../data/products";
import ProductCard from "../components/products/ProductCard";

export default function Wishlist() {
  const { ids } = useWishlist();
  const wishlisted = products.filter((p) => ids.includes(p.id));

  if (wishlisted.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-32 text-center">
        <p className="text-6xl mb-6">🤍</p>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">Tu lista de favoritos está vacía</h1>
        <p className="text-gray-500 mb-8">Guarda los perfumes que te gustan y encuéntralos aquí.</p>
        <Link
          to="/catalogo"
          className="inline-block bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-amber-500 transition-colors text-sm uppercase tracking-wider"
        >
          Explorar catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Mis favoritos</h1>
      <p className="text-gray-500 mb-8">{wishlisted.length} perfume{wishlisted.length !== 1 ? "s" : ""} guardado{wishlisted.length !== 1 ? "s" : ""}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlisted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
