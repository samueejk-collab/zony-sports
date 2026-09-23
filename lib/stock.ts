import { SITE } from "./site"

export type EstadoStock = "disponible" | "bajo" | "sin-stock"

export function estadoDeStock(stock: number): EstadoStock {
  if (stock <= 0) return "sin-stock"
  if (stock < SITE.umbralStockBajo) return "bajo"
  return "disponible"
}

export const ETIQUETA_STOCK: Record<EstadoStock, string> = {
  disponible: "Disponible",
  bajo: "Últimas unidades",
  "sin-stock": "Sin stock",
}
