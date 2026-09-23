import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { CATEGORIAS, SITE } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-1.5 rounded-full bg-brand" aria-hidden />
            <span className="font-display text-2xl leading-none tracking-wide">
              {SITE.nombre}
            </span>
          </div>
          <p className="mt-4 text-sm text-white/60">{SITE.descripcion}</p>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand">
            Catálogo
          </h2>
          <ul className="mt-4 space-y-2">
            {CATEGORIAS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand">
            Empresa
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/sobre-nosotros" className="text-sm text-white/70 transition-colors hover:text-white">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="text-sm text-white/70 transition-colors hover:text-white">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/carrito" className="text-sm text-white/70 transition-colors hover:text-white">
                Carrito
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand">
            Contacto
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <span>{SITE.direccion}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-brand" aria-hidden />
              <span>{SITE.telefono}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-brand" aria-hidden />
              <span>{SITE.email}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-xs text-white/50 md:px-6">
          © {new Date().getFullYear()} {SITE.nombre}. Venta exclusivamente por mayor.
        </div>
      </div>
    </footer>
  )
}
