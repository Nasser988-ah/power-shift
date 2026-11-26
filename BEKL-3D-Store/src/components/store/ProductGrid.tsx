import { Heart, Plus } from "lucide-react"
import type { CollectionFilter, Product } from "../../data/products"
import { discountPercent, filters } from "../../data/products"
import { formatEgp } from "../../lib/money"
import { useMall } from "../../state/mall-state"

type ProductGridProps = {
  products: Product[]
  filter: CollectionFilter
  selectedId: string
  favorites: string[]
  onFilter: (filter: CollectionFilter) => void
  onSelect: (id: string) => void
  onToggleFavorite: (id: string) => void
  onViewAll: () => void
}

export function ProductGrid({
  products,
  filter,
  selectedId,
  favorites,
  onFilter,
  onSelect,
  onToggleFavorite,
  onViewAll,
}: ProductGridProps) {
  const { addLine } = useMall()

  return (
    <section id="collection" className="min-w-0 bg-[#f7f4ee] px-4 py-6 text-ink lg:px-8 lg:py-8" aria-label="All products">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-ink/45">THE EDIT</p>
          <h2 className="font-display text-4xl leading-none">All products</h2>
        </div>
        {filter !== "all" && (
          <button className="h-11 text-sm underline" onClick={onViewAll}>
            View all products
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Categories">
        {filters.map((item) => {
          const selected = item.id === filter
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={selected}
              className={`h-11 px-3 text-sm ${selected ? "bg-ink text-ivory" : "bg-white text-ink"}`}
              onClick={() => onFilter(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-sm text-ink/70">Nothing in this edit. View all products to return to the floor.</p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => {
            const off = discountPercent(product)
            const loved = favorites.includes(product.id)
            return (
              <li key={product.id}>
                <article className={`flex h-full flex-col bg-[#f4ece3] ${product.id === selectedId ? "ring-1 ring-ink" : ""}`}>
                  <button className="relative aspect-[4/5] w-full" onClick={() => onSelect(product.id)} aria-label={`Show ${product.name}`}>
                    <img
                      src={product.imageSmall}
                      srcSet={`${product.imageSmall} 450w, ${product.image} 900w`}
                      sizes="(max-width: 640px) 46vw, 18vw"
                      alt={product.name}
                      width={450}
                      height={560}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    {off > 0 && <span className="absolute left-2 top-2 bg-ink px-1.5 py-1 text-[10px] text-ivory">-{off}%</span>}
                  </button>
                  <div className="flex items-start justify-between gap-2 px-3 pb-3">
                    <button className="min-w-0 text-left" onClick={() => onSelect(product.id)}>
                      <p className="text-sm leading-5">{product.name}</p>
                      <p className="mt-1 text-sm text-ink/80">{formatEgp(product.price)}</p>
                    </button>
                    <div className="flex shrink-0">
                      <button
                        className="grid h-11 w-11 place-items-center"
                        aria-label={loved ? `Remove ${product.name} from favorites` : `Save ${product.name}`}
                        aria-pressed={loved}
                        onClick={() => onToggleFavorite(product.id)}
                      >
                        <Heart size={18} fill={loved ? "currentColor" : "none"} />
                      </button>
                      <button
                        className="grid h-11 w-11 place-items-center"
                        aria-label={`Add ${product.name} to bag`}
                        onClick={() =>
                          addLine({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.imageSmall,
                          })
                        }
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
