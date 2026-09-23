import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { mensajeConsultaGeneral, whatsappLink } from "@/lib/whatsapp"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contacto",
}

export default function ContactoPage() {
  const datos = [
    { icon: MapPin, titulo: "Dirección", valor: SITE.direccion },
    { icon: Phone, titulo: "Teléfono", valor: SITE.telefono },
    { icon: Mail, titulo: "Email", valor: SITE.email },
    { icon: Clock, titulo: "Horario", valor: SITE.horario },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <header className="mb-10">
        <h1 className="font-display text-4xl tracking-wide md:text-5xl">Contacto</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Escribinos para consultas de precios, disponibilidad o para armar tu pedido por
          mayor. Respondemos en horario comercial.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {datos.map((d) => (
            <div key={d.titulo} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <d.icon className="size-5" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {d.titulo}
                </p>
                <p className="mt-0.5 font-medium">{d.valor}</p>
              </div>
            </div>
          ))}

          <a
            href={whatsappLink(mensajeConsultaGeneral())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 font-heading font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1fbe5b]"
          >
            Escribinos por WhatsApp
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            title="Ubicación de ZONY SPORT"
            src="https://www.google.com/maps?q=Av.+Corrientes+1234,+CABA,+Argentina&output=embed"
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
