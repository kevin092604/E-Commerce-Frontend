import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return addToast("Las contraseñas no coinciden", "error");
    if (form.password.length < 6)
      return addToast("La contraseña debe tener al menos 6 caracteres", "error");

    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.phone);
      addToast(`¡Cuenta creada! Bienvenido, ${user.name}`);
      navigate("/");
    } catch (err) {
      addToast(err.message || "Error al registrarse", "error");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const inputClass = "w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-1">
            Crear cuenta
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-amber-600 hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre completo *</label>
              <input type="text" required value={form.name} onChange={set("name")} className={inputClass} placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Correo electrónico *</label>
              <input type="email" required value={form.email} onChange={set("email")} className={inputClass} placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Teléfono</label>
              <input type="tel" value={form.phone} onChange={set("phone")} className={inputClass} placeholder="+504 9999-9999" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Contraseña *</label>
              <input type="password" required value={form.password} onChange={set("password")} className={inputClass} placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Confirmar contraseña *</label>
              <input type="password" required value={form.confirm} onChange={set("confirm")} className={inputClass} placeholder="Repite tu contraseña" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold py-3.5 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors disabled:opacity-50 text-sm uppercase tracking-wider mt-2"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
