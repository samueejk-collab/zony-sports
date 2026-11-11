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
  productoId: string | number
  nombre: string
  imagen: string
  talle: Talle
  cantidad: number
  precioUnitario: number
  unidadMinima: number
  stockDisponible: number
  [key: string]: any // Permite tolerar propiedades adicionales o viejas de localStorage
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
  actualizarCantidad: (productoId: string | number, talle: Talle, cantidad: number) => void
  quitar: (productoId: string | number, talle: Talle) => void
  vaciar: () => void
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const STORAGE_KEY = "zony-cart-v1"

const CartContext = createContext<CartContextValue | null>(null)

// Helper ultra seguro para extraer IDs sin importar cómo se llamen en localStorage
const obtenerId = (item: any) => String(item?.productoId ?? item?.id ?? item?.producto_id ?? "").trim()
const obtenerTalle = (item: any) => String(item?.talle ?? "").trim()

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // Aseguramos que cada item tenga la estructura correcta
        const normalizados = Array.isArray(parsed) ? parsed.map((i: any) => ({
          ...i,
          productoId: i.productoId ?? i.id ?? i.producto_id ?? 1,
          cantidad: Number(i.cantidad) || 1,
          precioUnitario: Number(i.precioUnitario) || 0,
          unidadMinima: Number(i.unidadMinima) || 1,
          stockDisponible: Number(i.stockDisponible) || 99,
        })) : []
        setItems(normalizados)
      }
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

  const agregar = useCallback(
    (producto: Producto, talle: Talle, cantidad: number, stockDisponible: number) => {
      setItems((prev: CartItem[]): CartItem[] => {
        const idStr = String(producto.id).trim()
        const talleStr = String(talle).trim()

        const index = prev.findIndex(
          (i) => obtenerId(i) === idStr && obtenerTalle(i) === talleStr
        )

        if (index >= 0) {
          const copia = [...prev]
          const existente = copia[index]
          const nuevaCantidad = Math.min(existente.cantidad + cantidad, stockDisponible)
          copia[index] = { ...existente, cantidad: nuevaCantidad, stockDisponible }
          return copia
        }

        const nuevoItem: CartItem = {
          productoId: producto.id,
          nombre: producto.nombre,
          imagen: producto.imagenes?.[0] || "/placeholder.svg",
          talle,
          cantidad: Math.min(cantidad, stockDisponible),
          precioUnitario: producto.precioMayorista,
          unidadMinima: producto.unidadMinimaPorPedido ?? 1,
          stockDisponible,
        }

        return [...prev, nuevoItem]
      })
    },
    [],
  )

  const actualizarCantidad = useCallback(
    (productoId: string | number, talle: Talle, cantidad: number) => {
      setItems((prev: CartItem[]): CartItem[] => {
        const idStr = String(productoId).trim()
        const talleStr = String(talle).trim()

        return prev.map((i) => {
          const mismoId = obtenerId(i) === idStr
          const mismoTalle = obtenerTalle(i) === talleStr

          if (!mismoId || !mismoTalle) return i

          const clamped = Math.max(1, Math.min(cantidad, Number(i.stockDisponible) || 99))
          return { ...i, cantidad: clamped }
        })
      })
    },
    [],
  )

  const quitar = useCallback((productoId: string | number, talle: Talle) => {
    setItems((prev: CartItem[]): CartItem[] => {
      const idStr = String(productoId).trim()
      const talleStr = String(talle).trim()

      return prev.filter(
        (i) => !(obtenerId(i) === idStr && obtenerTalle(i) === talleStr)
      )
    })
  }, [])

  const vaciar = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + (Number(i.cantidad) || 0), 0),
    [items],
  )
  const total = useMemo(
    () => items.reduce((acc, i) => acc + (Number(i.cantidad) || 0) * (Number(i.precioUnitario) || 0), 0),
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