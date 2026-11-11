import { useState, useEffect } from "react"
import { obtenerProductos } from "../services/ProductoService"

export function useProducto() {
  const [prods, setProds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function traerProds() {
      try {
        const data = await obtenerProductos()
        setProds(Array.isArray(data) ? data : data.content ?? [])
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }
    traerProds()
  }, [])

  return { prods, loading, error }
}