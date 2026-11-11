import Image from "next/image"
import Link from "next/link"
import { formatoPrecio } from "@/lib/format"
import { type Producto, stockTotal } from "@/lib/products"
import { estadoDeStock, ETIQUETA_STOCK } from "@/lib/stock"
import { cn, obtenerImagenProducto } from "@/lib/utils"

const badgeClases: Record<string, string> = {
  disponible: "bg-brand/15 text-brand",
  bajo: "bg-amber-500/15 text-amber-600",
  "sin-stock": "bg-neutral-200 text-neutral-500",
}

export function ProductCard({ producto }: { producto: Producto }) {
  const total = stockTotal(producto)
  const estado = estadoDeStock(total)

  // Forzamos que use la función basada en el nombre de la base de datos
  const imagenSrc = obtenerImagenProducto(producto.nombre)
  
  const minUnidades = producto.unidadMinimaPorPedido ?? 1

  return (
    <Link
      href={`/producto/${producto.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={imagenSrc}
          alt={producto.nombre || "Producto Zony Sports"}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold",
            badgeClases[estado],
          )}
        >
          {ETIQUETA_STOCK[estado]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-heading text-base font-bold leading-tight text-foreground">
          {producto.nombre}
        </h3>
        <p className="text-xs text-muted-foreground">{producto.descripcion || "Indumentaria deportiva"}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-xs text-muted-foreground">Precio mayorista</p>
            <p className="font-heading text-lg font-extrabold text-foreground">
              {formatoPrecio(producto.precioMayorista)}
            </p>
          </div>
          <span className="text-xs font-medium text-brand">
            Mín. {minUnidades} u.
          </span>
        </div>
      </div>
    </Link>
  )
}