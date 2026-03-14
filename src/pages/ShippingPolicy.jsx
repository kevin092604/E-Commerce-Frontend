export default function ShippingPolicy() {
  const sections = [
    {
      title: "Zonas de entrega",
      content:
        "Realizamos entregas en todo el territorio de Honduras. Las ciudades principales (Tegucigalpa, San Pedro Sula, La Ceiba) tienen tiempos de entrega de 1 a 3 días hábiles. Para otras zonas del país, el plazo es de 3 a 5 días hábiles.",
    },
    {
      title: "Costos de envío",
      content:
        "El costo de envío estándar es de L 120. Los pedidos mayores a L 3,500 tienen envío gratuito automáticamente. También puedes obtener envío gratis usando el código de descuento ENVIOGRATIS.",
    },
    {
      title: "Seguimiento de pedido",
      content:
        "Una vez confirmado tu pedido recibirás un número de seguimiento por correo electrónico. Puedes consultar el estado de tu pedido en cualquier momento desde la sección Mis Pedidos de tu cuenta.",
    },
    {
      title: "Empaque",
      content:
        "Todos nuestros productos se empacan de forma segura para evitar daños durante el transporte. Si elegiste empaque para regalo, tu pedido llegará en una caja especial con papel de seda y lazo.",
    },
    {
      title: "Pedidos dañados o incorrectos",
      content:
        "Si recibes un producto dañado o incorrecto, contáctanos dentro de las 48 horas siguientes a la entrega. Lo resolveremos con un reenvío sin costo adicional.",
    },
    {
      title: "Devoluciones",
      content:
        "Aceptamos devoluciones dentro de los 7 días posteriores a la recepción del pedido, siempre que el producto esté sin abrir y en su empaque original. Contáctanos a contacto@eliteparfums.hn para iniciar el proceso.",
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
        Política de envíos
      </h1>
      <div className="w-16 h-1 bg-amber-400 mb-10" />

      <div className="space-y-8">
        {sections.map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{content}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-2xl p-6">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          ¿Tienes alguna pregunta sobre tu envío? Escríbenos a{" "}
          <a href="mailto:contacto@eliteparfums.hn" className="text-amber-600 font-medium hover:underline">
            contacto@eliteparfums.hn
          </a>{" "}
          o llámanos al{" "}
          <a href="tel:+50422345678" className="text-amber-600 font-medium hover:underline">
            +504 2234-5678
          </a>
          .
        </p>
      </div>
    </main>
  );
}
