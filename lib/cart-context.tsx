"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { Producto, Talle } from "./products"

export interface CartItem {
  productoId: string
  nombre: string
  imagen: string
  talle: Talle
  cantidad: number
  precioUnitario: number
  unidadMinima: number
  stockDisponible: number
}

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  total: number
  agregar: (
    producto: Producto,
    talle: Talle,
    cantidad: number,
    stockDisponible: number,
  ) => void
  actualizarCantidad: (productoId: string, talle: Talle, cantidad: number) => void
  quitar: (productoId: string, talle: Talle) => void
  vaciar: () => void
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const STORAGE_KEY = "zony-cart-v1"

const CartContext = createContext<CartContextValue | null>(null)

function keyOf(productoId: string, talle: Talle) {
  return `${productoId}__${talle}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw) as CartItem[])
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated])

  const agregar = useCallback<CartContextValue["agregar"]>(
    (producto, talle, cantidad, stockDisponible) => {
      setItems((prev) => {
        const k = keyOf(producto.id, talle)
        const existente = prev.find((i) => keyOf(i.productoId, i.talle) === k)
        const yaEnCarrito = existente?.cantidad ?? 0
        // No superar el stock disponible del talle.
        const nuevaCantidad = Math.min(yaEnCarrito + cantidad, stockDisponible)
        if (existente) {
          return prev.map((i) =>
            keyOf(i.productoId, i.talle) === k
              ? { ...i, cantidad: nuevaCantidad, stockDisponible }
              : i,
          )
        }
        return [
          ...prev,
          {
            productoId: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagenes[0],
            talle,
            cantidad: Math.min(cantidad, stockDisponible),
            precioUnitario: producto.precioMayorista,
            unidadMinima: producto.unidadMinimaPorPedido,
            stockDisponible,
          },
        ]
      })
    },
    [],
  )

  const actualizarCantidad = useCallback<CartContextValue["actualizarCantidad"]>(
    (productoId, talle, cantidad) => {
      setItems((prev) =>
        prev.map((i) => {
          if (keyOf(i.productoId, i.talle) !== keyOf(productoId, talle)) return i
          const clamped = Math.max(1, Math.min(cantidad, i.stockDisponible))
          return { ...i, cantidad: clamped }
        }),
      )
    },
    [],
  )

  const quitar = useCallback<CartContextValue["quitar"]>((productoId, talle) => {
    setItems((prev) =>
      prev.filter((i) => keyOf(i.productoId, i.talle) !== keyOf(productoId, talle)),
    )
  }, [])

  const vaciar = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items],
  )
  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      total,
      agregar,
      actualizarCantidad,
      quitar,
      vaciar,
      isOpen,
      setOpen,
    }),
    [items, totalItems, total, agregar, actualizarCantidad, quitar, vaciar, isOpen],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider")
  return ctx
}
