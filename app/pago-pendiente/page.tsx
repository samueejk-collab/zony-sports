import type { Metadata } from "next"
import { PaymentResult } from "@/components/payment-result"

export const metadata: Metadata = { title: "Pago pendiente" }

export default function PagoPendientePage() {
  return <PaymentResult estado="pendiente" />
}
