const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const RUTA_CLIENTES = "/api/clientes"
const RUTA_DIRECCIONES = "/api/direcciones"
const RUTA_PEDIDOS = "/api/pedidos"

export interface DatosCliente {
  nombre: string
  telefono: string
  correo: string
}

export interface DatosDireccion {
  calle: string
  numero: string
  pisoDepto: string
  barrio: string
  ciudad: string
  provincia: string
  codigoPostal: string
}

async function post<T>(ruta: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let mensaje = `Error ${res.status} al guardar el pedido`
    try {
      const err = await res.json()
      if (err?.message) mensaje = err.message
    } catch {}
    throw new Error(mensaje)
  }
  return res.json() as Promise<T>
}

export async function crearPedidoCompleto(
  cliente: DatosCliente,
  direccion: DatosDireccion,
  subtotal: number,
  costoEnvio = 0,
) {
  // 1. Cliente (el correo es único en la base)
  let c: { id: number }
  try {
    c = await post<{ id: number }>(RUTA_CLIENTES, {
      nombreCliente: cliente.nombre.trim(),
      telefono: cliente.telefono.trim(),
      correo: cliente.correo.trim(),
      fecha: new Date().toISOString().slice(0, 10),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : ""
    if (msg.startsWith("Error 5")) {
      throw new Error(
        "No se pudo registrar el cliente. Si ya hiciste un pedido antes, probá con otro correo.",
      )
    }
    throw e
  }

  // 2. Dirección de envío
  const d = await post<{ id: number }>(RUTA_DIRECCIONES, {
    calle: direccion.calle.trim(),
    numero: direccion.numero.trim(),
    pisoDepto: direccion.pisoDepto.trim() || null,
    barrio: direccion.barrio.trim(),
    ciudad: direccion.ciudad.trim(),
    provincia: direccion.provincia.trim(),
    codigoPostal: direccion.codigoPostal.trim(),
  })

  // 3. Pedido
  return post<{ id: number }>(RUTA_PEDIDOS, {
    clienteId: c.id,
    direccionEnvioId: d.id,
    subtotal,
    costoEnvio,
  })
}