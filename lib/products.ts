import type { CategoriaSlug } from "./site"

export type Talle = "2" | "4" | "6"

export interface StockPorTalle {
  talle: Talle
  stock: number
}

export interface Producto {
  id: string
  nombre: string
  categoria: CategoriaSlug
  descripcion: string
  tela: string
  imagenes: string[]
  tallesDisponibles: StockPorTalle[]
  precioMayorista: number
  unidadMinimaPorPedido: number
  activo: boolean
}

export const PRODUCTOS: Producto[] = [
  {
    id: "campera-pro",
    nombre: "Campera Rompeviento Pro",
    categoria: "camperas",
    descripcion:
      "Campera rompeviento liviana con capucha ajustable y bolsillos con cierre. Ideal para entrenamiento al aire libre. Combinación negro con detalles en verde.",
    tela: "Poliéster microperforado repelente al agua",
    imagenes: ["/products/campera-pro.png"],
    tallesDisponibles: [
      { talle: "2", stock: 60 },
      { talle: "4", stock: 45 },
      { talle: "6", stock: 12 },
    ],
    precioMayorista: 18500,
    unidadMinimaPorPedido: 6,
    activo: true,
  },
  {
    id: "campera-elite",
    nombre: "Campera Softshell Elite",
    categoria: "camperas",
    descripcion:
      "Softshell térmica con detalles reflectivos plateados. Interior de micropolar. Combinación negro/plateado que puede variar según el pedido.",
    tela: "Softshell con membrana térmica e interior de micropolar",
    imagenes: ["/products/campera-elite.png"],
    tallesDisponibles: [
      { talle: "2", stock: 30 },
      { talle: "4", stock: 8 },
      { talle: "6", stock: 0 },
    ],
    precioMayorista: 23900,
    unidadMinimaPorPedido: 6,
    activo: true,
  },
  {
    id: "conjunto-training",
    nombre: "Conjunto Training",
    categoria: "conjuntos",
    descripcion:
      "Conjunto deportivo de buzo con capucha y pantalón jogger a tono. Puños y cintura elastizados. Negro con vivos en verde.",
    tela: "Frisa de algodón/poliéster",
    imagenes: ["/products/conjunto-training.png"],
    tallesDisponibles: [
      { talle: "2", stock: 40 },
      { talle: "4", stock: 40 },
      { talle: "6", stock: 25 },
    ],
    precioMayorista: 31500,
    unidadMinimaPorPedido: 4,
    activo: true,
  },
  {
    id: "conjunto-street",
    nombre: "Conjunto Urbano Street",
    categoria: "conjuntos",
    descripcion:
      "Conjunto urbano de buzo cuello redondo y pantalón recto. Estilo relajado para el día a día. Combinación negro/blanco.",
    tela: "Frisa premium peinada",
    imagenes: ["/products/conjunto-street.png"],
    tallesDisponibles: [
      { talle: "2", stock: 18 },
      { talle: "4", stock: 22 },
      { talle: "6", stock: 10 },
    ],
    precioMayorista: 29900,
    unidadMinimaPorPedido: 4,
    activo: true,
  },
  {
    id: "pantalon-jogger",
    nombre: "Pantalón Jogger Move",
    categoria: "pantalones",
    descripcion:
      "Jogger deportivo con cordón de ajuste en verde y bolsillos laterales. Puño elastizado en el tobillo.",
    tela: "Algodón con frisa liviana",
    imagenes: ["/products/pantalon-jogger.png"],
    tallesDisponibles: [
      { talle: "2", stock: 55 },
      { talle: "4", stock: 50 },
      { talle: "6", stock: 35 },
    ],
    precioMayorista: 14200,
    unidadMinimaPorPedido: 6,
    activo: true,
  },
  {
    id: "pantalon-cargo",
    nombre: "Pantalón Cargo Tactic",
    categoria: "pantalones",
    descripcion:
      "Cargo deportivo con múltiples bolsillos utilitarios y refuerzos. Resistente y funcional para todo uso.",
    tela: "Gabardina elastizada resistente",
    imagenes: ["/products/pantalon-cargo.png"],
    tallesDisponibles: [
      { talle: "2", stock: 14 },
      { talle: "4", stock: 6 },
      { talle: "6", stock: 4 },
    ],
    precioMayorista: 16800,
    unidadMinimaPorPedido: 6,
    activo: true,
  },
  {
    id: "remera-dryfit",
    nombre: "Remera Dry-Fit Basic",
    categoria: "otros",
    descripcion:
      "Remera de entrenamiento con tecnología de secado rápido y logo estampado en verde. Corte atlético.",
    tela: "Poliéster dry-fit transpirable",
    imagenes: ["/products/remera-dryfit.png"],
    tallesDisponibles: [
      { talle: "2", stock: 80 },
      { talle: "4", stock: 75 },
      { talle: "6", stock: 60 },
    ],
    precioMayorista: 8900,
    unidadMinimaPorPedido: 10,
    activo: true,
  },
  {
    id: "buzo-canguro",
    nombre: "Buzo Canguro Comfort",
    categoria: "otros",
    descripcion:
      "Buzo canguro con capucha forrada en verde y bolsillo frontal amplio. Abrigado y cómodo.",
    tela: "Frisa de algodón peinado",
    imagenes: ["/products/buzo-canguro.png"],
    tallesDisponibles: [
      { talle: "2", stock: 33 },
      { talle: "4", stock: 28 },
      { talle: "6", stock: 15 },
    ],
    precioMayorista: 19900,
    unidadMinimaPorPedido: 6,
    activo: true,
  },
]

export function getProductos(): Producto[] {
  return PRODUCTOS.filter((p) => p.activo)
}

export function getProductosPorCategoria(categoria: CategoriaSlug): Producto[] {
  return getProductos().filter((p) => p.categoria === categoria)
}

export function getProducto(id: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id && p.activo)
}

export function getDestacados(cantidad = 4): Producto[] {
  return getProductos().slice(0, cantidad)
}

export function stockTotal(producto: Producto): number {
  return producto.tallesDisponibles.reduce((acc, t) => acc + t.stock, 0)
}

export function stockDeTalle(producto: Producto, talle: Talle): number {
  return producto.tallesDisponibles.find((t) => t.talle === talle)?.stock ?? 0
}
