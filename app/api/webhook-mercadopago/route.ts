import crypto from "node:crypto"
import { NextResponse } from "next/server"

// Webhook de notificaciones de Mercado Pago.
// Verifica la firma (x-signature) antes de procesar y consulta el pago real
// contra la API de MP. La actualización de pedidos/stock requiere una base de
// datos (no configurada en esta versión), por lo que aquí solo se valida y
// registra la notificación de forma segura.
function firmaValida(request: Request, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) return false

  const xSignature = request.headers.get("x-signature") ?? ""
  const xRequestId = request.headers.get("x-request-id") ?? ""

  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => {
      const [k, v] = p.split("=")
      return [k?.trim(), v?.trim()]
    }),
  )
  const ts = parts["ts"]
  const hash = parts["v1"]
  if (!ts || !hash) return false

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex")
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const dataId = url.searchParams.get("data.id") ?? ""

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    // Sin credenciales configuradas simplemente acusamos recibo.
    return NextResponse.json({ received: true }, { status: 200 })
  }

  if (!firmaValida(request, dataId)) {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 })
  }

  try {
    // Consultar el estado real del pago contra la API de Mercado Pago.
    const pagoRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!pagoRes.ok) {
      return NextResponse.json({ error: "No se pudo verificar el pago." }, { status: 502 })
    }
    const pago = await pagoRes.json()
    // Aquí se actualizaría el pedido (external_reference) y el stock según
    // pago.status ("approved" | "rejected" | "cancelled") en la base de datos.
    console.log("[v0] Webhook MP verificado. Estado del pago:", pago.status)
    return NextResponse.json({ received: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Error procesando el webhook." }, { status: 500 })
  }
}
