import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { CATEGORIAS, type CategoriaSlug } from "@/lib/site"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

async function obtenerProductosDesdeBackend() {
  try {
    const respuesta = await fetch(`${API_URL}/api/productos`, { cache: "no-store" })
    if (!respuesta.ok) return []
    const data = await respuesta.json()
    // Soporta tanto si devuelve un array directo como un objeto Page de Spring Boot (.content)
    return Array.isArray(data) ? data : (data.content || [])
  } catch {
    return []
  }
}

export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ slug: c.slug }))
}

function categoriaValida(slug: string): slug is CategoriaSlug {
  return CATEGORIAS.some((c) => c.slug === slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const categoria = CATEGORIAS.find((c) => c.slug === slug)
  return { title: categoria?.nombre ?? "Catálogo" }
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!categoriaValida(slug)) notFound()

  const categoria = CATEGORIAS.find((c) => c.slug === slug)!

  // Obtenemos todos los productos del backend y filtramos por la categoría actual
  const todosLosProductos = await obtenerProductosDesdeBackend()
  const productos = todosLosProductos.filter(
    (p: any) => p.categoria === slug || p.categoria?.slug === slug
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-brand">Catálogo</p>
        <h1 className="mt-1 font-display text-4xl tracking-wide md:text-5xl">
          {categoria.nombre}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {productos.length}{" "}
          {productos.length === 1 ? "producto disponible" : "productos disponibles"} · precios
          por mayor
        </p>
      </header>

      {productos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No hay productos en esta categoría por el momento.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {productos.map((p: any) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  )
}