
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}

export function obtenerImagenProducto(nombre: string): string {
  if (!nombre) return "/products/hero.png"
  const n = nombre.toLowerCase()
  
  if (n.includes("rompeviento") || n.includes("campera")) return "/products/campera-pro.png"
  if (n.includes("elite")) return "/products/campera-elite.png"
  if (n.includes("conjunto")) return "/products/conjunto-training.png"
  if (n.includes("street")) return "/products/conjunto-street.png"
  if (n.includes("cargo")) return "/products/pantalon-cargo.png"
  if (n.includes("jogger") || n.includes("pantalon")) return "/products/pantalon-jogger.png"
  if (n.includes("remera") || n.includes("dryfit")) return "/products/remera-dryfit.png"
  if (n.includes("buzo") || n.includes("canguro")) return "/products/buzo-canguro.png"
  
  return "/products/hero.png"
}