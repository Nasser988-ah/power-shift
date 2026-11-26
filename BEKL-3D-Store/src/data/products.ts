export type ProductCategory = "men" | "women" | "accessories"

export type Product = {
  id: string
  name: string
  price: number
  compareAt?: number
  description: string
  category: ProductCategory
  image: string
  imageSmall: string
  isNew?: boolean
  offer?: boolean
}

export type CollectionFilter = "all" | ProductCategory | "new" | "offers"

/** BEKL's sample collection. Prices are Egyptian pounds. */
export const products: Product[] = [
  {
    id: "column-shirt",
    name: "Ivory Column Shirt",
    price: 1890,
    description: "A band-collar linen shirt cut long through the body, with a soft mother-of-pearl placket.",
    category: "men",
    image: `${import.meta.env.BASE_URL}products/bekl-column-shirt-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-column-shirt-520.webp`,
    isNew: true,
  },
  {
    id: "sand-trouser",
    name: "Sand Pleat Trouser",
    price: 2450,
    description: "A single-pleat wool trouser in warm sand, tailored with a clean break at the shoe.",
    category: "men",
    image: `${import.meta.env.BASE_URL}products/bekl-sand-trouser-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-sand-trouser-520.webp`,
  },
  {
    id: "cedar-overshirt",
    name: "Cedar Overshirt",
    price: 3200,
    description: "An unstructured cedar twill overshirt that sits between a shirt and a light jacket.",
    category: "men",
    image: `${import.meta.env.BASE_URL}products/bekl-cedar-overshirt-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-cedar-overshirt-520.webp`,
    isNew: true,
  },
  {
    id: "pearl-dress",
    name: "Pearl Bias Dress",
    price: 3280,
    compareAt: 4100,
    description: "A floor-length bias slip in pearl silk, with a quiet cowl neck and narrow straps.",
    category: "women",
    image: `${import.meta.env.BASE_URL}products/bekl-pearl-dress-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-pearl-dress-520.webp`,
    offer: true,
  },
  {
    id: "dune-trouser",
    name: "Dune Wide Trouser",
    price: 2650,
    description: "A fluid wide-leg trouser in dune wool, cut high at the waist and full through the hem.",
    category: "women",
    image: `${import.meta.env.BASE_URL}products/bekl-dune-trouser-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-dune-trouser-520.webp`,
  },
  {
    id: "clay-knit",
    name: "Clay Knit Set",
    price: 3600,
    description: "A fine clay knit tank and column skirt, worn as a set or taken apart.",
    category: "women",
    image: `${import.meta.env.BASE_URL}products/bekl-clay-knit-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-clay-knit-520.webp`,
    isNew: true,
  },
  {
    id: "sable-collar",
    name: "Sable Collar",
    price: 980,
    description: "A slim open collar in brushed bronze and gold, meant to sit at the base of the throat.",
    category: "accessories",
    image: `${import.meta.env.BASE_URL}products/bekl-sable-collar-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-sable-collar-520.webp`,
  },
  {
    id: "atelier-tote",
    name: "Atelier Tote",
    price: 2200,
    description: "A structured ivory leather tote with a quiet base and enough room for a day in the city.",
    category: "accessories",
    image: `${import.meta.env.BASE_URL}products/bekl-atelier-tote-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-atelier-tote-520.webp`,
  },
  {
    id: "woven-belt",
    name: "Woven Belt",
    price: 590,
    compareAt: 750,
    description: "A narrow woven leather belt in warm tan, finished with a small dark buckle.",
    category: "accessories",
    image: `${import.meta.env.BASE_URL}products/bekl-woven-belt-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-woven-belt-520.webp`,
    offer: true,
  },
  {
    id: "ivory-scarf",
    name: "Ivory Wrap",
    price: 890,
    description: "A light silk wrap in ivory, large enough for the shoulders and soft enough to knot.",
    category: "accessories",
    image: `${import.meta.env.BASE_URL}products/bekl-ivory-scarf-960.webp`,
    imageSmall: `${import.meta.env.BASE_URL}products/bekl-ivory-scarf-520.webp`,
    isNew: true,
  },
]

export const filters: { id: CollectionFilter; label: string }[] = [
  { id: "all", label: "All Products" },
  { id: "men", label: "Men's Wear" },
  { id: "women", label: "Women's Wear" },
  { id: "accessories", label: "Accessories" },
  { id: "new", label: "New Arrivals" },
  { id: "offers", label: "Offers" },
]

export function filterProducts(list: Product[], filter: CollectionFilter, query: string) {
  const q = query.trim().toLowerCase()
  return list.filter((product) => {
    const inFilter =
      filter === "all" ||
      (filter === "new" && product.isNew) ||
      (filter === "offers" && product.offer) ||
      product.category === filter
    if (!inFilter) return false
    if (!q) return true
    return (
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
    )
  })
}

export function discountPercent(product: Product) {
  if (!product.compareAt || product.compareAt <= product.price) return 0
  return Math.round((1 - product.price / product.compareAt) * 100)
}
