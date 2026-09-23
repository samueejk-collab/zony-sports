"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, ShoppingCart, X } from "lucide-react"
import { CATEGORIAS, SITE } from "@/lib/site"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

const navLinks = [
  ...CATEGORIAS.map((c) => ({ href: `/categoria/${c.slug}`, label: c.nombre })),
  { href: "/sobre-nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export function SiteHeader() {
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label={`${SITE.nombre} inicio`}>
          <span className="inline-block h-6 w-1.5 rounded-full bg-brand" aria-hidden />
          <span className="font-display text-2xl leading-none tracking-wide">
            {SITE.nombre}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navegación principal">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/carrito"
            className="relative inline-flex size-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
            aria-label={`Carrito, ${totalItems} artículos`}
          >
            <ShoppingCart className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-brand-foreground">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-white/10 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex w-full max-w-7xl flex-col px-4 py-2" aria-label="Navegación móvil">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
