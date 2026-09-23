import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Factory, Recycle, Ruler, Truck } from "lucide-react"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Sobre nosotros",
}

const valores = [
  { icon: Factory, titulo: "Producción nacional", texto: "Confeccionamos en Argentina con estándares de calidad." },
  { icon: Ruler, titulo: "Talles 2 al 6", texto: "Curva completa para cubrir toda tu demanda." },
  { icon: Recycle, titulo: "Catálogo rotativo", texto: "Renovamos modelos y colores cada temporada." },
  { icon: Truck, titulo: "Logística ágil", texto: "Despachos a todo el país de forma rápida y segura." },
]

export default function SobreNosotrosPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <Image src="/products/hero.png" alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/50" />
        </div>
        <div className="relative mx-auto w-full max-w-3xl px-4 py-20 text-center md:px-6">
          <h1 className="font-display text-4xl tracking-wide md:text-6xl">Sobre {SITE.nombre}</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Somos una marca argentina de indumentaria deportiva enfocada 100% en la venta por
            mayor. Acompañamos a comercios y revendedores de todo el país con productos de
            calidad y una curva de talles completa.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {valores.map((v) => (
            <div key={v.titulo} className="flex gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <v.icon className="size-6" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold">{v.titulo}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{v.texto}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-black p-8 text-center text-white md:p-12">
          <h2 className="font-display text-3xl tracking-wide md:text-4xl">
            ¿Listo para tu próximo pedido?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Explorá el catálogo de temporada y armá tu pedido por mayor en minutos.
          </p>
          <Link
            href="/categoria/camperas"
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand px-8 font-heading font-bold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Ver catálogo
          </Link>
        </div>
      </section>
    </div>
  )
}
