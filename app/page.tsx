import Image from "next/image"
import Link from "next/link"
import { ArrowRight, PackageCheck, ShieldCheck, Truck } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { getDestacados } from "@/lib/products"
import { CATEGORIAS, SITE } from "@/lib/site"

const categoriaImagenes: Record<string, string> = {
  camperas: "/products/campera-pro.png",
  conjuntos: "/products/conjunto-training.png",
  pantalones: "/products/pantalon-jogger.png",
  otros: "/products/buzo-canguro.png",
}

export default function HomePage() {
  const destacados = getDestacados(4)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <Image
            src="/products/hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-4 py-24 md:px-6 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            Venta por mayor
          </span>
          <h1 className="max-w-2xl font-display text-5xl leading-[0.95] tracking-wide md:text-7xl">
            Indumentaria deportiva que rinde{" "}
            <span className="text-brand">temporada tras temporada</span>
          </h1>
          <p className="max-w-lg text-base text-white/70 md:text-lg">
            {SITE.nombre} — marca argentina. Talles del 2 al 6, catálogo rotativo y
            envíos a todo el país. Comprá por mayor con mínimos accesibles.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/categoria/camperas"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand px-6 font-heading font-bold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90"
            >
              Ver catálogo <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sobre-nosotros"
              className="inline-flex h-12 items-center rounded-lg border border-white/30 px-6 font-heading font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Conocé la marca
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 md:px-6">
          {[
            { icon: Truck, titulo: "Envíos a todo el país", texto: "Despachamos a cualquier provincia." },
            { icon: PackageCheck, titulo: "Mínimos accesibles", texto: "Comprá por mayor desde pocas unidades." },
            { icon: ShieldCheck, titulo: "Calidad garantizada", texto: "Telas premium y terminaciones prolijas." },
          ].map((b) => (
            <div key={b.titulo} className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <b.icon className="size-5" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold">{b.titulo}</p>
                <p className="text-sm text-muted-foreground">{b.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-wide md:text-4xl">
              Explorá por categoría
            </h2>
            <p className="mt-1 text-muted-foreground">Encontrá lo que buscás en segundos.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIAS.map((c) => (
            <Link
              key={c.slug}
              href={`/categoria/${c.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-black"
            >
              <Image
                src={categoriaImagenes[c.slug] || "/placeholder.svg"}
                alt={c.nombre}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover opacity-70 transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <span className="font-display text-2xl tracking-wide text-white">
                  {c.nombre}
                </span>
                <ArrowRight className="size-5 text-brand transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="bg-muted/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl tracking-wide md:text-4xl">
                Destacados de temporada
              </h2>
              <p className="mt-1 text-muted-foreground">Lo más pedido por nuestros clientes.</p>
            </div>
            <Link
              href="/categoria/camperas"
              className="hidden shrink-0 items-center gap-1 font-heading text-sm font-bold uppercase text-brand hover:underline sm:inline-flex"
            >
              Ver todo <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {destacados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
