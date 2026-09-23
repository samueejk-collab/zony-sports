import type { Metadata } from "next"
import { CartView } from "@/components/cart-view"

export const metadata: Metadata = {
  title: "Carrito",
}

export default function CarritoPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <h1 className="mb-8 font-display text-4xl tracking-wide md:text-5xl">Tu pedido</h1>
      <CartView />
    </div>
  )
}
