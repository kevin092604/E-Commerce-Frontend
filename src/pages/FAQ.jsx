import { useState } from "react";

const faqs = [
  {
    q: "¿Los productos son originales?",
    a: "Sí, todos nuestros perfumes son 100% originales. Trabajamos exclusivamente con distribuidores autorizados y garantizamos la autenticidad de cada producto.",
  },
  {
    q: "¿Cuánto tarda mi pedido en llegar?",
    a: "En Tegucigalpa, San Pedro Sula y La Ceiba el tiempo de entrega es de 1 a 3 días hábiles. Para el resto del país, de 3 a 5 días hábiles.",
  },
  {
    q: "¿Cuál es el costo de envío?",
    a: "El envío estándar cuesta L 120. Los pedidos mayores a L 3,500 tienen envío gratuito. También puedes usar el código ENVIOGRATIS en el checkout.",
  },
  {
    q: "¿Puedo devolver un producto?",
    a: "Sí, aceptamos devoluciones dentro de los 7 días posteriores a la recepción, siempre que el producto esté sin abrir y en su empaque original. Contáctanos a contacto@eliteparfums.hn.",
  },
  {
    q: "¿Cómo pago mi pedido?",
    a: "Aceptamos tarjetas de crédito y débito Visa y Mastercard a través de Stripe, una plataforma de pago segura. Tu información bancaria nunca es almacenada en nuestros servidores.",
  },
  {
    q: "¿Puedo rastrear mi pedido?",
    a: "Sí. Una vez confirmado tu pedido recibirás un correo con el número de seguimiento. También puedes consultar el estado desde la sección Mis Pedidos en tu cuenta.",
  },
  {
    q: "¿Ofrecen empaque para regalo?",
    a: "Sí. Durante el checkout puedes seleccionar la opción de empaque para regalo e incluir un mensaje personalizado sin costo adicional.",
  },
  {
    q: "¿Tienen descuentos?",
    a: "Sí, tenemos los siguientes códigos de descuento: VERANO10 (10%), ELITE15 (15%), NUEVO250 (L 250 de descuento) y ENVIOGRATIS (envío gratis).",
  },
  {
    q: "¿Necesito crear una cuenta para comprar?",
    a: "Sí, es necesario crear una cuenta para completar la compra. Esto nos permite enviarte la confirmación de tu pedido y que puedas consultar tu historial de compras.",
  },
  {
    q: "¿Cómo puedo contactarlos?",
    a: "Puedes escribirnos a contacto@eliteparfums.hn, llamarnos al +504 2234-5678 o enviarnos un mensaje por WhatsApp. Atendemos de lunes a viernes de 8:00 am a 6:00 pm.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
        Preguntas frecuentes
      </h1>
      <div className="w-16 h-1 bg-amber-400 mb-10" />

      <div className="space-y-3">
        {faqs.map(({ q, a }, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left text-gray-900 dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {q}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 text-amber-400 flex-shrink-0 ml-4 transition-transform ${open === i ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                {a}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
