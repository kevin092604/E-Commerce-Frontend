import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      addToast(`Bienvenido, ${user.name}`);
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message || "Error al iniciar sesión", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-1">
            Iniciar sesión
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-amber-600 hover:underline font-medium">
              Regístrate gratis
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold py-3.5 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider mt-2"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400">
              Admin demo:{" "}
              <button
                type="button"
                onClick={() => setForm({ email: "admin@eliteparfums.com", password: "admin123" })}
                className="text-amber-600 hover:underline"
              >
                usar credenciales de prueba
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
