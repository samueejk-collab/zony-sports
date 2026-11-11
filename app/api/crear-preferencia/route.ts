import { NextResponse } from "next/server"

interface ItemEntrada {
  producto_id?: unknown
  talle?: unknown
  cantidad?: unknown
}

const TALLES_VALIDOS = ["2", "4", "6"]

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

  const itemsMP: { title: string; quantity: number; unit_price: number; currency_id: string }[] = []
  let total = 0

  for (const raw of body.items as ItemEntrada[]) {
    const productoId = raw.producto_id
    const talle = raw.talle
    const cantidad = raw.cantidad

    if (!TALLES_VALIDOS.includes(talle as string)) {
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

    try {
      // Consultamos directamente al backend de Spring Boot para obtener los datos reales de la BD
      const resBackend = await fetch(`http://localhost:8080/api/productos/${productoId}`, {
        cache: "no-store",
      })

      if (!resBackend.ok) {
        return NextResponse.json(
          { error: "Uno de los productos no existe o no está disponible." },
          { status: 400 },
        )
      }

      const producto = await resBackend.json()

      // Validaciones de precio y mínimos (ajustá las propiedades según lo que devuelva tu Spring Boot)
      const precio = producto.precio ?? producto.precioMayorista ?? 0
      const minUnidades = producto.unidadMinimaPorPedido ?? 1

      if (cantidad < minUnidades) {
        return NextResponse.json(
          {
            error: `${producto.nombre} requiere un mínimo de ${minUnidades} unidades.`,
          },
          { status: 400 },
        )
      }

      total += cantidad * precio
      itemsMP.push({
        title: `${producto.nombre} (Talle ${talle as string})`,
        quantity: cantidad,
        unit_price: precio,
        currency_id: "ARS",
      })
    } catch {
      return NextResponse.json(
        { error: "No se pudo validar el producto con el servidor de base de datos." },
        { status: 502 },
      )
    }
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
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