import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { useReviews } from "../context/ReviewContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Compare() {
  const { compareList, clearCompare, removeFromCompare } = useCompare();
  const { getAverageRating, getProductReviews } = useReviews();
  const { dispatch } = useCart();
  const { addToast } = useToast();

  if (compareList.length < 2) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-32 text-center">
        <div className="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-3">
          Comparador de perfumes
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Selecciona al menos 2 perfumes desde el catálogo para compararlos lado a lado.
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

  const rows = [
    {
      label: "Imagen",
      render: (p) => (
        <img src={p.image} alt={p.name} className="w-28 h-28 object-cover rounded-xl mx-auto" />
      ),
    },
    {
      label: "Marca",
      render: (p) => <span className="text-amber-600 font-semibold">{p.brand}</span>,
    },
    {
      label: "Categoría",
      render: (p) => <span className="capitalize">{p.category}</span>,
    },
    { label: "Volumen", render: (p) => `${p.ml} ml` },
    { label: "Tipo", render: (p) => p.type },
    {
      label: "Precio",
      render: (p) => (
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-bold text-gray-900 dark:text-white text-lg">
            L {p.price.toLocaleString()}
          </span>
          {p.originalPrice && (
            <span className="text-gray-400 line-through text-sm">
              L {p.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Rating",
      render: (p) => {
        const avg = getAverageRating(p.id);
        const count = getProductReviews(p.id).length;
        return count > 0 ? (
          <span className="text-amber-500">★ {avg.toFixed(1)} <span className="text-gray-400 dark:text-gray-500">({count})</span></span>
        ) : (
          <span className="text-gray-400">Sin reseñas</span>
        );
      },
    },
    { label: "Nota de salida", render: (p) => p.notes.top },
    { label: "Nota de corazón", render: (p) => p.notes.heart },
    { label: "Nota de base", render: (p) => p.notes.base },
    {
      label: "Descripción",
      render: (p) => (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-48 mx-auto">
          {p.description}
        </p>
      ),
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Comparador</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Comparando {compareList.length} perfumes
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg"
        >
          Limpiar todo
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 w-36 font-medium">
                Atributo
              </th>
              {compareList.map((p) => (
                <th key={p.id} className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-serif font-bold text-gray-900 dark:text-white text-lg">
                      {p.name}
                    </span>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      × Quitar
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, render }) => (
              <tr key={label} className="border-t border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="p-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  {label}
                </td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center text-sm text-gray-700 dark:text-gray-300">
                    {render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-gray-100 dark:border-gray-700">
              <td className="p-4" />
              {compareList.map((p) => (
                <td key={p.id} className="p-4 text-center">
                  <button
                    onClick={() => {
                      dispatch({ type: "ADD_ITEM", payload: p });
                      addToast(`${p.name} agregado al carrito`);
                    }}
                    className="bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold px-6 py-2.5 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors text-sm"
                  >
                    + Carrito
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
