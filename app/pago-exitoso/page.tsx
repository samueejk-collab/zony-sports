import type { Metadata } from "next"
import { PaymentResult } from "@/components/payment-result"

export const metadata: Metadata = { title: "Pago exitoso" }

export default function PagoExitosoPage() {
  return <PaymentResult estado="exitoso" />
}
