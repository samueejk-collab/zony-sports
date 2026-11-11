const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export async function obtenerProductos() {
  const respuesta = await fetch(`${API_URL}/api/productos`)
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al traer productos`)
  }
  const data = await respuesta.json()

  return Array.isArray(data) ? data : (data.content || [])
}