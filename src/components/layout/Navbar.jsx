import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCompare } from "../../context/CompareContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { products } from "../../data/products";

export default function Navbar() {
  const { totalItems } = useCart();
  const { count: wishCount } = useWishlist();
  const { compareList } = useCompare();
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCatalogMenu, setShowCatalogMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const catalogRef = useRef(null);
  const userRef = useRef(null);

  const suggestions = useMemo(() => {
    if (search.trim().length < 2) return [];
    const q = search.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 6);
  }, [search]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
      if (catalogRef.current && !catalogRef.current.contains(e.target)) setShowCatalogMenu(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/producto/${product.id}`);
    setSearch("");
    setShowSuggestions(false);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-2xl font-serif font-bold tracking-widest text-amber-400">
            ELITE <span className="text-white">PARFUMS</span>
          </h1>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-amber-400 transition-colors">Inicio</Link>

          {/* Catálogo dropdown */}
          <div ref={catalogRef} className="relative">
            <button
              onClick={() => setShowCatalogMenu((v) => !v)}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors"
            >
              Catálogo
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform ${showCatalogMenu ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCatalogMenu && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                {[
                  { label: "Todo", to: "/catalogo" },
                  { label: "Hombre", to: "/catalogo?cat=hombre" },
                  { label: "Mujer", to: "/catalogo?cat=mujer" },
                  { label: "Unisex", to: "/catalogo?cat=unisex" },
                ].map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setShowCatalogMenu(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-amber-500 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/quienes-somos" className="hover:text-amber-400 transition-colors">Nosotros</Link>
          <Link to="/contacto" className="hover:text-amber-400 transition-colors">Contacto</Link>
        </nav>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-sm ml-auto relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Buscar perfume..."
                className="w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSuggestionClick(p)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100 dark:bg-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand} · L {p.price.toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{p.type}</span>
                </button>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button onClick={handleSearch} className="w-full text-center text-xs text-amber-600 hover:text-amber-700 py-2.5 font-medium">
                  Ver todos los resultados →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark mode */}
        <button
          onClick={toggle}
          title={dark ? "Modo claro" : "Modo oscuro"}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
            </svg>
          )}
        </button>

        {/* User */}
        {user ? (
          <div ref={userRef} className="relative flex-shrink-0">
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              title={user.name}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
              </svg>
            </button>
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                {user.role === "ADMIN" && (
                  <Link to="/admin" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-amber-500 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Panel Admin
                  </Link>
                )}
                <Link to="/pedidos" onClick={() => setShowUserMenu(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Mis pedidos
                </Link>
                <button
                  onClick={() => { logout(); setShowUserMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            title="Iniciar sesión"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
            </svg>
          </Link>
        )}

        {/* Wishlist */}
        <Link to="/favoritos" className="relative flex-shrink-0 w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" title="Favoritos">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 0 1 0-6.364z" />
          </svg>
          {wishCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/carrito" className="relative flex-shrink-0 w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" title="Carrito">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

      </div>
    </header>
  );
}
