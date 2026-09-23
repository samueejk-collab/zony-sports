"use client"

import Link from "next/link"
import { useEffect } from "react"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

type Estado = "exitoso" | "fallido" | "pendiente"

const config: Record<
  Estado,
  { icon: typeof CheckCircle2; color: string; titulo: string; texto: string; limpiar: boolean }
> = {
  exitoso: {
    icon: CheckCircle2,
    color: "text-brand",
    titulo: "¡Pago confirmado!",
    texto:
      "Recibimos tu pago correctamente. Nos pondremos en contacto para coordinar el envío de tu pedido.",
    limpiar: true,
  },
  pendiente: {
    icon: Clock,
    color: "text-amber-500",
    titulo: "Pago pendiente",
    texto:
      "Tu pago está siendo procesado. Te avisaremos apenas se confirme. Puede demorar unos minutos.",
    limpiar: false,
  },
  fallido: {
    icon: XCircle,
    color: "text-destructive",
    titulo: "El pago no se completó",
    texto:
      "No pudimos procesar tu pago. Podés intentar nuevamente o enviarnos tu pedido por WhatsApp.",
    limpiar: false,
  },
}

export function PaymentResult({ estado }: { estado: Estado }) {
  const { vaciar } = useCart()
  const { icon: Icon, color, titulo, texto, limpiar } = config[estado]

  useEffect(() => {
    if (limpiar) vaciar()
  }, [limpiar, vaciar])

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4 py-24 text-center">
      <Icon className={cn("size-16", color)} />
      <h1 className="font-display text-4xl tracking-wide">{titulo}</h1>
      <p className="text-muted-foreground">{texto}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-lg bg-brand px-6 font-heading font-bold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Volver al inicio
        </Link>
        {estado !== "exitoso" && (
          <Link
            href="/carrito"
            className="inline-flex h-11 items-center rounded-lg border border-border px-6 font-heading font-bold uppercase tracking-wide transition-colors hover:bg-muted"
          >
            Volver al carrito
          </Link>
        )}
      </div>
    </div>
  )
}
