import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { AddToCart } from "@/components/add-to-cart"
import { ProductCard } from "@/components/product-card"
import { formatoPrecio } from "@/lib/format"
import {
  getProducto,
  getProductosPorCategoria,
  PRODUCTOS,
} from "@/lib/products"
import { CATEGORIAS } from "@/lib/site"

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const producto = getProducto(id)
  return {
    title: producto?.nombre ?? "Producto",
    description: producto?.descripcion,
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const producto = getProducto(id)
  if (!producto) notFound()

  const categoria = CATEGORIAS.find((c) => c.slug === producto.categoria)
  const relacionados = getProductosPorCategoria(producto.categoria)
    .filter((p) => p.id !== producto.id)
    .slice(0, 4)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground" aria-label="Ruta">
        <Link href="/" className="hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="size-4" />
        <Link href={`/categoria/${producto.categoria}`} className="hover:text-foreground">
          {categoria?.nombre}
        </Link>
        <ChevronRight className="size-4" />
        <span className="truncate text-foreground">{producto.nombre}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={producto.imagenes[0] || "/placeholder.svg"}
            alt={producto.nombre}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-brand">
            {categoria?.nombre}
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-wide md:text-5xl">
            {producto.nombre}
          </h1>

          <div className="mt-4 flex items-end gap-2">
            <span className="font-heading text-3xl font-extrabold">
              {formatoPrecio(producto.precioMayorista)}
            </span>
            <span className="pb-1 text-sm text-muted-foreground">
              por unidad · precio mayorista
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">{producto.descripcion}</p>

          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Tela</dt>
              <dd className="font-medium">{producto.tela}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Unidad mínima</dt>
              <dd className="font-medium">{producto.unidadMinimaPorPedido} unidades</dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-border pt-8">
            <AddToCart producto={producto} />
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl tracking-wide md:text-3xl">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {relacionados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
