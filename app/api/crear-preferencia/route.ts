import { NextResponse } from "next/server"
import { getProducto, stockDeTalle, type Talle } from "@/lib/products"

interface ItemEntrada {
  producto_id?: unknown
  talle?: unknown
  cantidad?: unknown
}

const TALLES_VALIDOS: Talle[] = ["2", "4", "6"]

export async function POST(request: Request) {
  let body: { items?: unknown; cliente?: { nombre?: unknown; telefono?: unknown } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 })
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "El pedido no tiene items." }, { status: 400 })
  }

  // Recalcular precios y validar stock SIEMPRE del lado del servidor.
  // El frontend nunca es fuente de verdad para precios ni stock.
  const itemsMP: { title: string; quantity: number; unit_price: number; currency_id: string }[] = []
  let total = 0

  for (const raw of body.items as ItemEntrada[]) {
    const productoId = typeof raw.producto_id === "string" ? raw.producto_id : ""
    const talle = raw.talle
    const cantidad = raw.cantidad

    if (!TALLES_VALIDOS.includes(talle as Talle)) {
      return NextResponse.json({ error: `Talle inválido en el pedido.` }, { status: 400 })
    }
    if (
      typeof cantidad !== "number" ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0 ||
      cantidad > 100000
    ) {
      return NextResponse.json({ error: "Cantidad inválida en el pedido." }, { status: 400 })
    }

    const producto = getProducto(productoId)
    if (!producto) {
      return NextResponse.json(
        { error: "Uno de los productos no existe o no está disponible." },
        { status: 400 },
      )
    }

    const stock = stockDeTalle(producto, talle as Talle)
    if (cantidad > stock) {
      return NextResponse.json(
        { error: `Stock insuficiente para ${producto.nombre} talle ${talle as string}.` },
        { status: 409 },
      )
    }
    if (cantidad < producto.unidadMinimaPorPedido) {
      return NextResponse.json(
        {
          error: `${producto.nombre} requiere un mínimo de ${producto.unidadMinimaPorPedido} unidades.`,
        },
        { status: 400 },
      )
    }

    total += cantidad * producto.precioMayorista
    itemsMP.push({
      title: `${producto.nombre} (Talle ${talle as string})`,
      quantity: cantidad,
      unit_price: producto.precioMayorista,
      currency_id: "ARS",
    })
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    // Sin credenciales de Mercado Pago no se puede crear el pago online.
    // El checkout por WhatsApp sigue funcionando como alternativa.
    return NextResponse.json(
      {
        error:
          "El pago online con Mercado Pago aún no está configurado. Enviá tu pedido por WhatsApp y te pasamos el link de pago.",
        needsSetup: true,
        total,
      },
      { status: 501 },
    )
  }

  // Con credenciales presentes se crea la preferencia contra la API de Mercado Pago.
  const origin = new URL(request.url).origin
  try {
    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: itemsMP,
        back_urls: {
          success: `${origin}/pago-exitoso`,
          failure: `${origin}/pago-fallido`,
          pending: `${origin}/pago-pendiente`,
        },
        auto_return: "approved",
        external_reference: `zony-${Date.now()}`,
      }),
    })

    const data = await mpRes.json()
    if (!mpRes.ok) {
      return NextResponse.json(
        { error: "Mercado Pago rechazó la solicitud." },
        { status: 502 },
      )
    }
    return NextResponse.json({ init_point: data.init_point })
  } catch {
    return NextResponse.json(
      { error: "No se pudo contactar a Mercado Pago." },
      { status: 502 },
    )
  }
}
