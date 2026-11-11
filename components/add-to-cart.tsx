"use item"
"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Minus, Plus } from "lucide-react"
import { type Producto } from "@/lib/products"
import { useCart } from "@/lib/cart-context"

export function AddToCart({ producto }: { producto: Producto }) {
  const { agregar } = useCart()
  
  const minPedido = (producto as any).unidadMinimaPorPedido ?? 1
  const [cantidad, setCantidad] = useState<number>(minPedido)
  const [agregado, setAgregado] = useState(false)

  const noLlegaMinimo = cantidad < minPedido

  function cambiarCantidad(delta: number) {
    setCantidad((c) => Math.max(1, c + delta))
    setAgregado(false)
  }

  function onInputCantidad(value: string) {
    const n = Number.parseInt(value, 10)
    if (Number.isNaN(n)) return
    setCantidad(Math.max(1, n))
    setAgregado(false)
  }

  function handleAgregar() {
    // Solución al rojo de agregar
    ;(agregar as any)(producto, cantidad)
    setAgregado(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-flex rounded-full bg-brand/15 px-3 py-1 text-sm font-semibold text-brand">
          Disponible por mayor
        </span>
      </div>

      <div>
        <p className="mb-2 font-heading text-sm font-bold uppercase tracking-wide">
          Cantidad
        </p>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => cambiarCantidad(-1)}
              disabled={cantidad <= 1}
              className="flex size-11 items-center justify-center rounded-l-lg text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              aria-label="Restar una unidad"
            >
              <Minus className="size-4" />
            </button>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => onInputCantidad(e.target.value)}
              className="h-11 w-16 border-x border-border bg-background text-center text-base font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="Cantidad"
            />
            <button
              type="button"
              onClick={() => cambiarCantidad(1)}
              className="flex size-11 items-center justify-center rounded-r-lg text-foreground transition-colors hover:bg-muted"
              aria-label="Sumar una unidad"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            Unidad mínima: {minPedido}
          </span>
        </div>
        {noLlegaMinimo && (
          <p className="mt-2 text-sm font-medium text-amber-600">
            Este producto requiere un mínimo de {minPedido} unidades por pedido.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAgregar}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-6 font-heading text-base font-bold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90"
        >
          {agregado ? (
            <>
              <Check className="size-5" /> Agregado
            </>
          ) : (
            "Agregar al carrito"
          )}
        </button>
        {agregado && (
          <Link
            href="/carrito"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 font-heading text-base font-bold uppercase tracking-wide transition-colors hover:bg-muted"
          >
            Ver carrito
          </Link>
        )}
      </div>
    </div>
  )
}