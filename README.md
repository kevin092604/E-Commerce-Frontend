# Elite Parfums 🧴

Tienda de perfumes de lujo con carrito de compras, panel de administración, pagos con Stripe y confirmación por email. Construida con React + Vite en el frontend y Node.js + Express + PostgreSQL en el backend.

---

## Tecnologías

### Frontend
| Tecnología | Versión |
|---|---|
| React | 19 |
| React Router DOM | 7 |
| Tailwind CSS | 4 |
| Vite | 7 |
| Stripe.js | 5 |

### Backend
| Tecnología | Versión |
|---|---|
| Node.js | 22 |
| Express | 4 |
| Prisma ORM | 5 |
| PostgreSQL | 15 |
| Stripe | 17 |
| Nodemailer | 6 |
| jsonwebtoken | 9 |

---

## Funcionalidades

### Tienda
- Catálogo con filtros por categoría, marca, tipo (EDP/EDT/EDC), notas olfativas y ofertas
- Búsqueda con sugerencias en tiempo real
- Vista detallada de producto con zoom de imagen y selector de tamaño (3 variantes)
- Carrito de compras persistente
- Lista de favoritos (wishlist)
- Comparador de hasta 3 productos
- Historial de vistos recientemente
- Modo oscuro

### Checkout
- Formulario de datos personales y dirección
- Empaque para regalo con mensaje personalizado
- Códigos de descuento (VERANO10, ELITE15, NUEVO250, ENVIOGRATIS)
- Pago real con Stripe (PaymentElement)
- Fecha estimada de entrega
- Email de confirmación automático

### Cuenta de usuario
- Registro e inicio de sesión con JWT
- Historial de pedidos con detalle expandible
- Quick view modal en el catálogo

### Panel de administración (`/admin`)
- Dashboard con KPIs: ingresos, pedidos, usuarios, productos
- Productos más vendidos y órdenes recientes
- CRUD completo de productos con subida de imágenes a Cloudinary
- Gestión de órdenes con cambio de estado
- Gestión de usuarios con cambio de rol (CUSTOMER / ADMIN)

---

## Estructura del proyecto

```
perfume-shop/
├── src/                        # Frontend React
│   ├── api/
│   │   └── client.js           # Fetch wrapper con JWT
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── products/
│   │   │   └── ProductCard.jsx
│   │   └── ui/
│   │       ├── CompareBar.jsx
│   │       ├── QuickViewModal.jsx
│   │       ├── StripePaymentForm.jsx
│   │       ├── Toast.jsx
│   │       └── WhatsAppButton.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── CompareContext.jsx
│   │   ├── ReviewContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── ToastContext.jsx
│   │   └── WishlistContext.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── Cart.jsx
│   │   ├── Catalog.jsx
│   │   ├── Checkout.jsx
│   │   ├── Compare.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Register.jsx
│   │   └── Wishlist.jsx
│   └── utils/
│       ├── orders.js
│       └── recentlyViewed.js
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js             # 40 productos + usuario admin
│   └── src/
│       ├── controllers/
│       │   ├── admin.controller.js
│       │   ├── auth.controller.js
│       │   ├── orders.controller.js
│       │   ├── payments.controller.js
│       │   ├── products.controller.js
│       │   ├── reviews.controller.js
│       │   └── users.controller.js
│       ├── lib/
│       │   ├── mailer.js
│       │   └── prisma.js
│       ├── middleware/
│       │   ├── admin.js
│       │   ├── auth.js
│       │   └── upload.js
│       ├── routes/
│       │   ├── admin.routes.js
│       │   ├── auth.routes.js
│       │   ├── orders.routes.js
│       │   ├── payments.routes.js
│       │   ├── products.routes.js
│       │   ├── reviews.routes.js
│       │   └── users.routes.js
│       ├── services/
│       │   └── email.service.js
│       └── index.js
├── .github/
│   └── workflows/
│       ├── frontend.yml        # Deploy → Azure Static Web Apps
│       └── backend.yml         # Deploy → Azure App Service
├── staticwebapp.config.json
└── .env.local
```

---

## Instalación local

### Requisitos
- Node.js 22+
- PostgreSQL 15+
- Cuenta de Cloudinary (imágenes)
- Cuenta de Stripe (pagos)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/perfume-shop.git
cd perfume-shop
```

### 2. Frontend

```bash
npm install
```

Crear `.env.local` en la raíz:

```env
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### 3. Backend

```bash
cd backend
npm install
```

Copiar y completar las variables de entorno:

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/perfume_shop
JWT_SECRET=un_secreto_largo_y_aleatorio
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
SMTP_USER=tu@gmail.com
SMTP_PASS=contraseña_de_aplicación
```

### 4. Base de datos

```bash
cd backend
npx prisma migrate dev --name init
node prisma/seed.js
```

El seed crea 40 productos y un usuario administrador:
- **Email:** `admin@eliteparfums.com`
- **Contraseña:** `admin123`

### 5. Ejecutar

En dos terminales separadas:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
npm run dev
```

Frontend disponible en `http://localhost:5173`
Backend disponible en `http://localhost:3001`

---

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Perfil del usuario autenticado |
| PUT | `/api/auth/me` | Actualizar perfil |

### Productos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Listar productos (con filtros) |
| GET | `/api/products/:id` | Detalle de producto |
| POST | `/api/products` | Crear producto (Admin) |
| PUT | `/api/products/:id` | Editar producto (Admin) |

### Órdenes
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/orders` | Crear orden |
| GET | `/api/orders` | Mis órdenes |
| GET | `/api/orders/:id` | Detalle de orden |

### Pagos
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/payments/create-intent` | Crear PaymentIntent de Stripe |

### Admin
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/stats` | KPIs del dashboard |
| GET | `/api/admin/orders` | Todas las órdenes |
| PATCH | `/api/admin/orders/:id/status` | Cambiar estado de orden |
| GET | `/api/admin/users` | Todos los usuarios |
| PATCH | `/api/admin/users/:id/role` | Cambiar rol de usuario |

---

## Deploy en Azure

### Servicios utilizados
| Componente | Servicio |
|---|---|
| Frontend | Azure Static Web Apps |
| Backend | Azure App Service (Node 22) |
| Base de datos | Azure Database for PostgreSQL Flexible Server |
| Imágenes | Cloudinary |

### GitHub Secrets requeridos

| Secret | Descripción |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Token del Static Web App |
| `VITE_API_URL` | URL del backend en producción |
| `VITE_STRIPE_PUBLIC_KEY` | Clave pública de Stripe (live) |
| `AZURE_WEBAPP_NAME` | Nombre del App Service |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Publish profile del App Service |

### Variables de entorno en Azure App Service

```
DATABASE_URL
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
STRIPE_SECRET_KEY
FRONTEND_URL
SMTP_USER
SMTP_PASS
```

El despliegue se activa automáticamente con cada `git push` a `main`.

---

## Tarjetas de prueba (Stripe)

| Número | Resultado |
|---|---|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 0002` | Tarjeta rechazada |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

Fecha: cualquiera futura · CVV: cualquier 3 dígitos

---

## Cupones de descuento

| Código | Descuento |
|---|---|
| `VERANO10` | 10% de descuento |
| `ELITE15` | 15% de descuento |
| `NUEVO250` | L 250 de descuento |
| `ENVIOGRATIS` | Envío gratis |
