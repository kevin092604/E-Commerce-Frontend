import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { products } from "../data/products";
import { getRecentlyViewedIds } from "../utils/recentlyViewed";
import ProductCard from "../components/products/ProductCard";

const featured = products.filter((p) => p.badge === "Bestseller").slice(0, 4);
const newArrivals = products.filter((p) => p.badge === "Nuevo" || p.badge === "Cult").slice(0, 4);

export default function Home() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    const prods = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    setRecentlyViewed(prods);
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />
        <img
          src="https://picsum.photos/seed/hero-perfume/1400/600"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-32">
          <p className="text-amber-400 uppercase tracking-[0.3em] text-sm font-medium mb-4">
            Colección 2026
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
            El aroma<br />que te define
          </h1>
          <p className="text-gray-300 text-lg max-w-md mb-8">
            Descubre más de 40 fragancias de las marcas más icónicas del mundo. Desde clásicos atemporales hasta joyas modernas.
          </p>
          <Link
            to="/catalogo"
            className="inline-block bg-amber-400 text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-amber-300 transition-colors text-sm uppercase tracking-wider"
          >
            Ver colección completa
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8 text-center">
          Explora por categoría
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Hombre", cat: "hombre", seed: "perfume-man" },
            { label: "Mujer", cat: "mujer", seed: "perfume-woman" },
            { label: "Unisex", cat: "unisex", seed: "perfume-unisex" },
          ].map(({ label, cat, seed }) => (
            <Link
              key={cat}
              to={`/catalogo?cat=${cat}`}
              className="relative rounded-2xl overflow-hidden h-60 group"
            >
              <img
                src={`https://picsum.photos/seed/${seed}/600/400`}
                alt={label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              <span className="absolute bottom-6 left-6 text-white text-2xl font-serif font-bold">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Más vendidos</h2>
            <Link to="/catalogo" className="text-amber-600 text-sm font-medium hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="bg-amber-400 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Envío gratis en pedidos mayores a L 3,500
          </h2>
          <p className="text-gray-700 mb-6">
            Todos nuestros perfumes son 100% originales. Garantía de autenticidad en cada compra.
          </p>
          <Link
            to="/catalogo"
            className="inline-block bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-gray-700 transition-colors text-sm uppercase tracking-wider"
          >
            Comprar ahora
          </Link>
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Novedades y cultos</h2>
          <Link to="/catalogo" className="text-amber-600 text-sm font-medium hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                Vistos recientemente
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
