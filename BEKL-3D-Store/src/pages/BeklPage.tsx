import { useEffect, useMemo, useState } from "react"
import { filterProducts, products, type CollectionFilter } from "../data/products"
import { FeaturedProduct } from "../components/store/FeaturedProduct"
import { ProductGrid } from "../components/store/ProductGrid"
import { StoreHeader } from "../components/store/StoreHeader"

const FAVORITES_KEY = "psm-favorites"

function readFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    const parsed = raw ? (JSON.parse(raw) as string[]) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function BeklPage() {
  const [index, setIndex] = useState(0)
  const [filter, setFilter] = useState<CollectionFilter>("all")
  const [query, setQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>(readFavorites)

  useEffect(() => {
    document.title = "BEKL — Power Shift Mall"
  }, [])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % products.length)
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + products.length) % products.length)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const visible = useMemo(() => filterProducts(products, filter, query), [filter, query])
  const featured = products[index]

  function step(direction: number) {
    setIndex((current) => (current + direction + products.length) % products.length)
  }

  function viewAll() {
    setFilter("all")
    setQuery("")
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div id="content" className="min-h-dvh bg-ivory text-ink">
      <StoreHeader query={query} onQuery={setQuery} />
      <div>
        <FeaturedProduct product={featured} onPrev={() => step(-1)} onNext={() => step(1)} onViewAll={viewAll} />
        <ProductGrid
          products={visible}
          filter={filter}
          selectedId={featured.id}
          favorites={favorites}
          onFilter={setFilter}
          onSelect={(id) => {
            const next = products.findIndex((item) => item.id === id)
            if (next >= 0) setIndex(next)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          onToggleFavorite={(id) =>
            setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
          }
          onViewAll={viewAll}
        />
      </div>
    </div>
  )
}
