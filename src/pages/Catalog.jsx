import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/products/ProductCard";

const sortOptions = [
  { value: "default", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre A-Z" },
];

const allBrands = [...new Set(products.map((p) => p.brand))].sort();
const allTypes = [...new Set(products.map((p) => p.type))].sort();

const allNotes = [...new Set(
  products.flatMap((p) => [
    ...p.notes.top.split(",").map((n) => n.trim()),
    ...p.notes.heart.split(",").map((n) => n.trim()),
    ...p.notes.base.split(",").map((n) => n.trim()),
  ])
)].sort();

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 9000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  const catParam = searchParams.get("cat") || "todos";
  const query = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    let list = [...products];

    if (catParam !== "todos") {
      list = list.filter((p) => p.category === catParam);
    }

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedTypes.length > 0) {
      list = list.filter((p) => selectedTypes.includes(p.type));
    }

    if (selectedNote) {
      const note = selectedNote.toLowerCase();
      list = list.filter(
        (p) =>
          p.notes.top.toLowerCase().includes(note) ||
          p.notes.heart.toLowerCase().includes(note) ||
          p.notes.base.toLowerCase().includes(note)
      );
    }

    if (onlyOffers) {
      list = list.filter((p) => p.originalPrice !== null);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [catParam, query, priceRange, selectedBrands, selectedTypes, selectedNote, onlyOffers, sort]);

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "todos") {
      params.delete("cat");
    } else {
      params.set("cat", cat);
    }
    params.delete("q");
    setSearchParams(params);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedNote("");
    setOnlyOffers(false);
    setPriceRange([0, 9000]);
  };

  const activeFilters = selectedBrands.length + selectedTypes.length + (selectedNote ? 1 : 0) + (onlyOffers ? 1 : 0);
  const cats = ["todos", "hombre", "mujer", "unisex"];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
          {query ? `Resultados para "${query}"` : "Catálogo de Perfumes"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{filtered.length} productos encontrados</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-60 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">

            {/* Category */}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider text-xs">
                Categoría
              </h2>
              <ul className="space-y-1">
                {cats.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                        catParam === cat || (cat === "todos" && !searchParams.get("cat"))
                          ? "bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-medium"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {cat === "todos" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price range */}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider text-xs">
                Precio máximo: L {priceRange[1].toLocaleString()}
              </h2>
              <input
                type="range"
                min={0}
                max={9000}
                step={250}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>L 0</span>
                <span>L 9,000</span>
              </div>
            </div>

            {/* Brands */}
            <div>
              <button
                onClick={() => setBrandOpen((v) => !v)}
                className="w-full flex items-center justify-between font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-xs mb-2"
              >
                <span>Marca {selectedBrands.length > 0 && `(${selectedBrands.length})`}</span>
                <span className="text-gray-400">{brandOpen ? "▲" : "▼"}</span>
              </button>
              {brandOpen && (
                <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {allBrands.map((brand) => (
                    <li key={brand}>
                      <label className="flex items-center gap-2 px-1 py-1 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="accent-amber-500 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{brand}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Type EDP/EDT/EDC */}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider text-xs">
                Tipo {selectedTypes.length > 0 && `(${selectedTypes.length})`}
              </h2>
              <div className="flex gap-2 flex-wrap">
                {allTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${
                      selectedTypes.includes(type)
                        ? "bg-gray-900 dark:bg-amber-400 dark:text-gray-900 border-gray-900 dark:border-amber-400 text-white"
                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Note */}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider text-xs">
                Nota olfativa
              </h2>
              <input
                type="text"
                value={selectedNote}
                onChange={(e) => setSelectedNote(e.target.value)}
                placeholder="Ej: Rosa, Oud, Vainilla..."
                list="notes-list"
                className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <datalist id="notes-list">
                {allNotes.map((n) => <option key={n} value={n} />)}
              </datalist>
            </div>

            {/* Only offers */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className="accent-amber-500 rounded w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Solo ofertas</span>
              </label>
            </div>

            {/* Clear filters */}
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="w-full text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 rounded-lg py-2 transition-colors"
              >
                Limpiar {activeFilters} filtro{activeFilters !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Sort */}
          <div className="flex justify-end mb-5">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">&#129481;</p>
              <p className="text-lg dark:text-gray-500">No encontramos perfumes con esos filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
