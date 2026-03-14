import { useState } from "react";
import { useReviews } from "../../context/ReviewContext";

function Stars({ rating, interactive = false, onSelect }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onSelect(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`text-2xl leading-none transition-colors ${interactive ? "cursor-pointer" : "cursor-default"} ${
            star <= (hovered || rating) ? "text-amber-400" : "text-gray-200"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }) {
  const { addReview, getProductReviews, getAverageRating } = useReviews();
  const reviews = getProductReviews(productId);
  const avg = getAverageRating(productId);

  const [form, setForm] = useState({ author: "", comment: "", rating: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.rating === 0) { setError("Selecciona una calificación."); return; }
    if (!form.author.trim()) { setError("Escribe tu nombre."); return; }
    if (!form.comment.trim()) { setError("Escribe un comentario."); return; }
    addReview({ productId, ...form });
    setForm({ author: "", comment: "", rating: 0 });
    setSubmitted(true);
    setError("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Reseñas</h2>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-8 bg-gray-50 rounded-2xl p-5">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</p>
            <Stars rating={Math.round(avg)} />
            <p className="text-xs text-gray-400 mt-1">{reviews.length} reseña{reviews.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-2">{star}</span>
                  <span className="text-amber-400">★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-amber-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 && (
        <p className="text-gray-400 text-sm mb-8">Aún no hay reseñas. ¡Sé el primero!</p>
      )}
      <div className="space-y-4 mb-8">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-gray-900">{r.author}</p>
              <p className="text-xs text-gray-400">{r.date}</p>
            </div>
            <Stars rating={r.rating} />
            <p className="text-gray-600 text-sm mt-2">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-serif font-bold text-lg text-gray-900 mb-4">Deja tu reseña</h3>
        {submitted && (
          <p className="text-emerald-600 text-sm mb-4 font-medium">¡Gracias por tu reseña!</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-2 font-medium">Calificación *</label>
            <Stars rating={form.rating} interactive onSelect={(r) => setForm((f) => ({ ...f, rating: r }))} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Tu nombre *</label>
            <input
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              placeholder="Ej. María López"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Comentario *</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="¿Qué te pareció este perfume?"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white font-bold px-6 py-2.5 rounded-full hover:bg-amber-500 transition-colors text-sm"
          >
            Publicar reseña
          </button>
        </form>
      </div>
    </section>
  );
}
