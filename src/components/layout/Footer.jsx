import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-serif font-bold text-amber-400 tracking-widest mb-3">
            ELITE PARFUMS
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Tu destino para los mejores perfumes del mundo. Fragancias auténticas, entregadas con elegancia directamente a tu puerta.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 uppercase tracking-wider text-sm">Tienda</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalogo" className="hover:text-amber-400 transition-colors">Catálogo completo</Link></li>
            <li><Link to="/catalogo?cat=hombre" className="hover:text-amber-400 transition-colors">Perfumes Hombre</Link></li>
            <li><Link to="/catalogo?cat=mujer" className="hover:text-amber-400 transition-colors">Perfumes Mujer</Link></li>
            <li><Link to="/catalogo?cat=unisex" className="hover:text-amber-400 transition-colors">Unisex</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 uppercase tracking-wider text-sm">Información</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/quienes-somos" className="hover:text-amber-400 transition-colors">Quiénes somos</Link></li>
            <li><Link to="/contacto" className="hover:text-amber-400 transition-colors">Contacto</Link></li>
            <li><Link to="/politica-de-envios" className="hover:text-amber-400 transition-colors">Política de envíos</Link></li>
            <li><Link to="/faq" className="hover:text-amber-400 transition-colors">Preguntas frecuentes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 uppercase tracking-wider text-sm">Contacto</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Tegucigalpa, Honduras</li>
            <li>+504 2234-5678</li>
            <li>contacto@eliteparfums.hn</li>
            <li>Lun – Vie, 8:00 am – 6:00 pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center text-xs text-gray-500 py-4">
        © 2026 Elite Parfums. Todos los derechos reservados.
      </div>
    </footer>
  );
}
