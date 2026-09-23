import type { Metadata } from "next"
import { PaymentResult } from "@/components/payment-result"

export const metadata: Metadata = { title: "Pago fallido" }

export default function PagoFallidoPage() {
  return <PaymentResult estado="fallido" />
}
