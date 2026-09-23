"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Minus, Plus } from "lucide-react"
import { type Producto, type Talle } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { estadoDeStock, ETIQUETA_STOCK } from "@/lib/stock"
import { cn } from "@/lib/utils"

export function AddToCart({ producto }: { producto: Producto }) {
  const { agregar } = useCart()
  const conStock = producto.tallesDisponibles.filter((t) => t.stock > 0)
  const primerTalle = conStock[0]?.talle ?? null

  const [talle, setTalle] = useState<Talle | null>(primerTalle)
  const [cantidad, setCantidad] = useState<number>(
    Math.min(producto.unidadMinimaPorPedido, conStock[0]?.stock ?? producto.unidadMinimaPorPedido),
  )
  const [agregado, setAgregado] = useState(false)

  const stockTalle =
    producto.tallesDisponibles.find((t) => t.talle === talle)?.stock ?? 0
  const estado = estadoDeStock(stockTalle)
  const sinStock = stockTalle <= 0 || talle === null
  const noLlegaMinimo = cantidad < producto.unidadMinimaPorPedido

  function seleccionarTalle(t: Talle, stock: number) {
    setTalle(t)
    setCantidad(Math.min(producto.unidadMinimaPorPedido, stock))
    setAgregado(false)
  }

  function cambiarCantidad(delta: number) {
    setCantidad((c) => Math.max(1, Math.min(c + delta, stockTalle)))
    setAgregado(false)
  }

  function onInputCantidad(value: string) {
    const n = Number.parseInt(value, 10)
    if (Number.isNaN(n)) return
    setCantidad(Math.max(1, Math.min(n, stockTalle)))
    setAgregado(false)
  }

  function handleAgregar() {
    if (sinStock || talle === null) return
    agregar(producto, talle, cantidad, stockTalle)
    setAgregado(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-sm font-semibold",
            estado === "disponible" && "bg-brand/15 text-brand",
            estado === "bajo" && "bg-amber-500/15 text-amber-600",
            estado === "sin-stock" && "bg-neutral-200 text-neutral-500",
          )}
        >
          {ETIQUETA_STOCK[estado]}
          {estado === "bajo" && talle ? ` · ${stockTalle} u.` : ""}
        </span>
      </div>

      <div>
        <p className="mb-2 font-heading text-sm font-bold uppercase tracking-wide">
          Talle
        </p>
        <div className="flex flex-wrap gap-2">
          {producto.tallesDisponibles.map((t) => {
            const disabled = t.stock <= 0
            const activo = t.talle === talle
            return (
              <button
                key={t.talle}
                type="button"
                disabled={disabled}
                onClick={() => seleccionarTalle(t.talle, t.stock)}
                aria-pressed={activo}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg border text-base font-bold transition-colors",
                  disabled &&
                    "cursor-not-allowed border-dashed border-border text-muted-foreground/40 line-through",
                  !disabled && activo && "border-brand bg-brand text-brand-foreground",
                  !disabled &&
                    !activo &&
                    "border-border bg-background hover:border-brand hover:text-brand",
                )}
              >
                {t.talle}
              </button>
            )
          })}
        </div>
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
              disabled={sinStock || cantidad <= 1}
              className="flex size-11 items-center justify-center rounded-l-lg text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              aria-label="Restar una unidad"
            >
              <Minus className="size-4" />
            </button>
            <input
              type="number"
              min={1}
              max={stockTalle}
              value={cantidad}
              disabled={sinStock}
              onChange={(e) => onInputCantidad(e.target.value)}
              className="h-11 w-16 border-x border-border bg-background text-center text-base font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label="Cantidad"
            />
            <button
              type="button"
              onClick={() => cambiarCantidad(1)}
              disabled={sinStock || cantidad >= stockTalle}
              className="flex size-11 items-center justify-center rounded-r-lg text-foreground transition-colors hover:bg-muted disabled:opacity-40"
              aria-label="Sumar una unidad"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            Unidad mínima: {producto.unidadMinimaPorPedido}
          </span>
        </div>
        {!sinStock && noLlegaMinimo && (
          <p className="mt-2 text-sm font-medium text-amber-600">
            Este producto requiere un mínimo de {producto.unidadMinimaPorPedido} unidades
            por pedido.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAgregar}
          disabled={sinStock}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-6 font-heading text-base font-bold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {agregado ? (
            <>
              <Check className="size-5" /> Agregado
            </>
          ) : sinStock ? (
            "Sin stock"
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
