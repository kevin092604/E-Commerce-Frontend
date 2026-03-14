import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-2xl border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <p className="text-sm font-semibold text-amber-400 flex-shrink-0">
          Comparar ({compareList.length}/3)
        </p>

        <div className="flex-1 flex items-center gap-3 overflow-x-auto">
          {compareList.map((p) => (
            <div key={p.id} className="flex items-center gap-2 bg-gray-800 rounded-full pl-2 pr-3 py-1.5 flex-shrink-0">
              <img src={p.image} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
              <span className="text-xs font-medium max-w-28 truncate">{p.name}</span>
              <button
                onClick={() => removeFromCompare(p.id)}
                className="text-gray-400 hover:text-white ml-1 leading-none"
                title="Quitar"
              >
                ×
              </button>
            </div>
          ))}

          {Array.from({ length: 3 - compareList.length }).map((_, i) => (
            <div
              key={`slot-${i}`}
              className="w-36 h-9 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center flex-shrink-0"
            >
              <span className="text-gray-600 text-xs">+ Añadir</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Limpiar
          </button>
          {compareList.length >= 2 && (
            <Link
              to="/comparar"
              className="bg-amber-400 text-gray-900 font-bold px-5 py-2 rounded-full text-sm hover:bg-amber-300 transition-colors whitespace-nowrap"
            >
              Comparar ahora
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
