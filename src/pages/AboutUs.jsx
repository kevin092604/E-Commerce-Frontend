export default function AboutUs() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
        Quiénes somos
      </h1>
      <div className="w-16 h-1 bg-amber-400 mb-10" />

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Elite Parfums nació con una misión clara: acercar las fragancias más icónicas del mundo a Honduras. Creemos que un buen perfume no es un lujo, es una forma de expresión personal.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            Seleccionamos cada fragancia cuidadosamente para garantizar autenticidad y calidad. Trabajamos directamente con distribuidores autorizados para que puedas comprar con total confianza.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Desde Tegucigalpa, llevamos el mundo de la perfumería de lujo a tu puerta.
          </p>
        </div>
        <img
          src="https://picsum.photos/seed/about-perfume/600/400"
          alt="Nuestra tienda"
          className="rounded-2xl object-cover w-full h-72"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { value: "40+", label: "Fragancias disponibles" },
          { value: "100%", label: "Productos originales" },
          { value: "24h", label: "Atención al cliente" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
            <p className="text-4xl font-serif font-bold text-amber-400 mb-2">{value}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">Misión</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Brindar a nuestros clientes acceso a las mejores fragancias del mundo con autenticidad garantizada, ofreciendo una experiencia de compra elegante, segura y personalizada desde Honduras.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">Visión</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Convertirnos en la tienda de perfumería de lujo de referencia en Centroamérica, reconocida por la calidad de sus productos, la confianza de sus clientes y su compromiso con la excelencia en el servicio.
          </p>
        </div>
      </div>

      <div className="bg-gray-900 text-white rounded-2xl p-10">
        <h2 className="text-2xl font-serif font-bold mb-4">Nuestra promesa</h2>
        <ul className="space-y-3 text-gray-300 text-sm">
          {[
            "Todos nuestros productos son 100% originales y tienen garantía de autenticidad.",
            "Empaque cuidadoso para que tu pedido llegue en perfectas condiciones.",
            "Proceso de compra seguro y protegido.",
            "Atención personalizada para ayudarte a encontrar tu fragancia ideal.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
