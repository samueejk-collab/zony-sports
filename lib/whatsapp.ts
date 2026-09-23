import type { CartItem } from "./cart-context"
import { formatoPrecio } from "./format"
import { SITE } from "./site"

export function whatsappLink(mensaje?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

export function mensajeConsultaGeneral(): string {
  return `Hola! Tengo una consulta sobre ${SITE.nombre}`
}

export function mensajePedido(items: CartItem[], total: number): string {
  const lineas = items.map((i) => {
    const subtotal = i.cantidad * i.precioUnitario
    return `- ${i.nombre} talle ${i.talle} x${i.cantidad} - ${formatoPrecio(subtotal)}`
  })
  return [
    "Hola! Quiero hacer este pedido:",
    ...lineas,
    "",
    `Total: ${formatoPrecio(total)}`,
  ].join("\n")
}
