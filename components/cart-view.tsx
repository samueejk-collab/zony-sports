"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AlertTriangle, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatoPrecio } from "@/lib/format"
import { mensajePedido, whatsappLink } from "@/lib/whatsapp"

export function CartView() {
  const { items, actualizarCantidad, quitar } = useCart()
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [mpEstado, setMpEstado] = useState<"idle" | "cargando" | "error">("idle")
  const [mpMensaje, setMpMensaje] = useState<string | null>(null)

  // Validación robusta para evitar NaN
  const obtenerCantidadSegura = (cant: any) => {
    const num = Number(cant)
    return Number.isNaN(num) || num < 1 ? 1 : num
  }

  const itemsBajoMinimo = items.filter((i) => {
    const cant = obtenerCantidadSegura(i.cantidad)
    return cant < (i.unidadMinima || 1)
  })
  const cumpleMinimos = itemsBajoMinimo.length === 0

  const totalSeguro = items.reduce((acc, i) => {
    const cant = obtenerCantidadSegura(i.cantidad)
    return acc + (cant * i.precioUnitario)
  }, 0)

  async function pagarConMercadoPago() {
    setMpEstado("cargando")
    setMpMensaje(null)
    try {
      const res = await fetch("/api/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            producto_id: i.productoId,
            talle: i.talle,
            cantidad: obtenerCantidadSegura(i.cantidad),
          })),
          cliente: { nombre, telefono },
        }),
      })
      const data = await res.json()
      if (res.ok && data.init_point) {
        window.location.href = data.init_point as string
        return
      }
      setMpEstado("error")
      setMpMensaje(
        data.error ??
          "No se pudo iniciar el pago. Probá enviando el pedido por WhatsApp.",
      )
    } catch {
      setMpEstado("error")
      setMpMensaje("Error de conexión. Probá enviando el pedido por WhatsApp.")
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-7 text-muted-foreground" />
        </div>
        <h2 className="font-heading text-xl font-bold">Tu carrito está vacío</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Explorá el catálogo y sumá productos para armar tu pedido mayorista.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex h-11 items-center rounded-lg bg-brand px-6 font-heading font-bold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {items.map((i) => {
          const cantidadValida = obtenerCantidadSegura(i.cantidad)
          const subtotal = cantidadValida * i.precioUnitario
          const bajoMinimo = cantidadValida < i.unidadMinima

          return (
            <div
              key={`${i.productoId}-${i.talle}`}
              className="flex gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={i.imagen || "/placeholder.svg"}
                  alt={i.nombre}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/producto/${i.productoId}`}
                      className="font-heading font-bold leading-tight hover:text-brand"
                    >
                      {i.nombre}
                    </Link>
                    <p className="text-sm text-muted-foreground">Talle {i.talle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => quitar(i.productoId, i.talle)}
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    aria-label={`Quitar ${i.nombre} talle ${i.talle}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                  <div className="inline-flex items-center rounded-lg border border-border">
                    {/* Botón Restar */}
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(i.productoId, i.talle, cantidadValida - 1)}
                      disabled={cantidadValida <= 1}
                      className="flex size-9 items-center justify-center rounded-l-lg transition-colors hover:bg-muted disabled:opacity-40 cursor-pointer"
                      aria-label="Restar una unidad"
                    >
                      <Minus className="size-4" />
                    </button>
                    
                    {/* Input manual */}
                    <input
                      type="number"
                      min={1}
                      max={i.stockDisponible}
                      value={cantidadValida}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === "") {
                          actualizarCantidad(i.productoId, i.talle, 1)
                          return
                        }
                        const n = Number.parseInt(val, 10)
                        if (!Number.isNaN(n)) actualizarCantidad(i.productoId, i.talle, n)
                      }}
                      className="h-9 w-14 border-x border-border bg-background text-center font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      aria-label={`Cantidad de ${i.nombre}`}
                    />

                    {/* Botón Sumar */}
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(i.productoId, i.talle, cantidadValida + 1)}
                      disabled={cantidadValida >= i.stockDisponible}
                      className="flex size-9 items-center justify-center rounded-r-lg transition-colors hover:bg-muted disabled:opacity-40 cursor-pointer"
                      aria-label="Sumar una unidad"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatoPrecio(i.precioUnitario)} c/u
                    </p>
                    <p className="font-heading text-lg font-extrabold">
                      {formatoPrecio(subtotal)}
                    </p>
                  </div>
                </div>

                {bajoMinimo && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-amber-600">
                    <AlertTriangle className="size-4 shrink-0" />
                    Mínimo {i.unidadMinima} unidades para este producto.
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <div className="space-y-5 rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide">
            Resumen del pedido
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Nombre
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre o comercio"
                className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </label>
            <label className="block text-sm font-medium">
              Teléfono
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Cód. área + número"
                inputMode="tel"
                className="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-base font-bold uppercase">Total</span>
            <span className="font-heading text-2xl font-extrabold">
              {formatoPrecio(totalSeguro)}
            </span>
          </div>

          {!cumpleMinimos && (
            <p className="flex items-start gap-1.5 rounded-lg bg-amber-500/10 p-3 text-sm font-medium text-amber-600">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              Ajustá las cantidades: {itemsBajoMinimo.length}{" "}
              {itemsBajoMinimo.length === 1 ? "producto no llega" : "productos no llegan"} a su
              unidad mínima.
            </p>
          )}

          {mpMensaje && (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">{mpMensaje}</p>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={pagarConMercadoPago}
              disabled={!cumpleMinimos || mpEstado === "cargando"}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#009EE3] px-6 font-heading text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#008fcc] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mpEstado === "cargando" && <Loader2 className="size-5 animate-spin" />}
              Pagar con Mercado Pago
            </button>
            <a
              href={cumpleMinimos ? whatsappLink(mensajePedido(items, totalSeguro)) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!cumpleMinimos}
              onClick={(e) => {
                if (!cumpleMinimos) e.preventDefault()
              }}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 font-heading text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1fbe5b] aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              Enviar pedido por WhatsApp
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Venta exclusivamente por mayor · Envíos a todo el país
          </p>
        </div>
      </aside>
    </div>
  )
}