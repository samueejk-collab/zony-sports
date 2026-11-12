export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

export function obtenerImagenProducto(nombre: string): string {
  if (!nombre) return "/placeholder.svg"
  const n = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  
  if (n.includes("adapt")) return "/products/conjunto-adapt.png"
  if (n.includes("hoodie")) return "/products/hoodie-negro.png"
  if (n.includes("gris")) return "/products/campera-gris.png"
  if (n.includes("black")) return "/products/pantalon-black.png"
  if (n.includes("short")) return "/products/short-running.png"

  if (n.includes("elite") || n.includes("softshell")) return "/products/campera-elite.png"
  if (n.includes("rompeviento") || n.includes("campera")) return "/products/campera-pro.png"
  if (n.includes("street") || n.includes("urbano")) return "/products/conjunto-street.png"
  if (n.includes("conjunto")) return "/products/conjunto-training.png"
  if (n.includes("cargo")) return "/products/pantalon-cargo.png"
  if (n.includes("jogger") || n.includes("pantalon")) return "/products/pantalon-jogger.png"
  if (n.includes("remera") || n.includes("dry")) return "/products/remera-dryfit.png"
  if (n.includes("buzo") || n.includes("canguro")) return "/products/buzo-canguro.png"

  return "/placeholder.svg"
}
