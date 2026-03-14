import { useState, useEffect } from "react";
import { api } from "../../api/client";

const EMPTY = { name: "", brand: "", price: "", originalPrice: "", category: "hombre", ml: "100", type: "EDP", description: "", badge: "", stock: "100", notes: { top: "", heart: "", base: "" }, image: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | product
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    api.get("/products?limit=100")
      .then((d) => setProducts(d.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setForm(EMPTY); setImageFile(null); setModal("create"); };
  const openEdit = (p) => {
    setForm({
      name: p.name, brand: p.brand, price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      category: p.category, ml: String(p.ml), type: p.type,
      description: p.description, badge: p.badge || "", stock: String(p.stock),
      notes: p.notes || { top: "", heart: "", base: "" }, image: p.image,
    });
    setImageFile(null);
    setModal(p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "notes") fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (imageFile) fd.append("image", imageFile);

      if (modal === "create") await api.post("/products", fd);
      else await api.put(`/products/${modal.id}`, fd);

      fetchProducts();
      setModal(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p) => {
    await api.put(`/products/${p.id}`, JSON.stringify({ active: !p.active }));
    fetchProducts();
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setNote = (k) => (e) => setForm((f) => ({ ...f, notes: { ...f.notes, [k]: e.target.value } }));

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} productos en total</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-gray-900 text-white font-bold px-5 py-2.5 rounded-full hover:bg-amber-500 transition-colors text-sm"
        >
          + Nuevo producto
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o marca..."
        className="mb-6 w-full max-w-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-700">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand} · {p.ml}ml · {p.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-300">{p.category}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-semibold">
                    L {p.price.toLocaleString()}
                    {p.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">L {p.originalPrice.toLocaleString()}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${p.stock <= 10 ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {p.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(p)} className="text-amber-600 hover:text-amber-700 font-medium text-xs">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-serif font-bold text-xl text-gray-900 dark:text-white">
                {modal === "create" ? "Nuevo producto" : `Editar: ${modal.name}`}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-gray-500 mb-1 font-medium">Nombre *</label>
                <input required value={form.name} onChange={set("name")} className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-gray-500 mb-1 font-medium">Marca *</label>
                <input required value={form.brand} onChange={set("brand")} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Precio (L) *</label>
                <input required type="number" value={form.price} onChange={set("price")} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Precio original (L)</label>
                <input type="number" value={form.originalPrice} onChange={set("originalPrice")} className={inputClass} placeholder="Dejar vacío si no hay oferta" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Categoría</label>
                <select value={form.category} onChange={set("category")} className={inputClass}>
                  {["hombre", "mujer", "unisex"].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Tipo</label>
                <select value={form.type} onChange={set("type")} className={inputClass}>
                  {["EDP", "EDT", "EDC"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Volumen (ml) *</label>
                <input required type="number" value={form.ml} onChange={set("ml")} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Stock</label>
                <input type="number" value={form.stock} onChange={set("stock")} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Badge</label>
                <select value={form.badge} onChange={set("badge")} className={inputClass}>
                  {["", "Bestseller", "Nuevo", "Oferta", "Premium", "Cult", "Icónico", "Lujo", "Clásico"].map((b) => (
                    <option key={b} value={b}>{b || "Sin badge"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium">Imagen (URL o subir)</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                {form.image && !imageFile && <p className="text-xs text-gray-400 mt-1 truncate">Actual: {form.image}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1 font-medium">Descripción *</label>
                <textarea required rows={2} value={form.description} onChange={set("description")} className={`${inputClass} resize-none`} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-2 font-medium">Notas olfativas</label>
                <div className="grid grid-cols-3 gap-2">
                  {[["top", "Salida"], ["heart", "Corazón"], ["base", "Base"]].map(([k, lbl]) => (
                    <div key={k}>
                      <label className="block text-xs text-gray-400 mb-1">{lbl}</label>
                      <input value={form.notes[k]} onChange={setNote(k)} className={inputClass} placeholder={`Nota de ${lbl.toLowerCase()}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2 flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-full hover:bg-amber-500 transition-colors text-sm disabled:opacity-50">
                  {saving ? "Guardando..." : modal === "create" ? "Crear producto" : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
