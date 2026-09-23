const formatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatoPrecio(valor: number): string {
  return formatter.format(valor)
}
