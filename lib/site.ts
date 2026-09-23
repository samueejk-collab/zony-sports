// Configuración central de la marca. Reemplazá WHATSAPP_NUMBER por el número real
// en formato internacional sin signos (ej: 5491122334455).
export const SITE = {
  nombre: "ZONY SPORT",
  descripcion: "Indumentaria deportiva por mayor. Envíos a todo el país.",
  whatsapp: "5491122334455",
  email: "ventas@zonysport.com.ar",
  telefono: "+54 9 11 2233-4455",
  direccion: "Av. Corrientes 1234, CABA, Argentina",
  horario: "Lunes a Viernes de 9 a 18 hs",
  // Umbral de stock para mostrar "Últimas unidades"
  umbralStockBajo: 20,
} as const

export const CATEGORIAS = [
  { slug: "camperas", nombre: "Camperas" },
  { slug: "conjuntos", nombre: "Conjuntos" },
  { slug: "pantalones", nombre: "Pantalones" },
  { slug: "otros", nombre: "Otros" },
] as const

export type CategoriaSlug = (typeof CATEGORIAS)[number]["slug"]
